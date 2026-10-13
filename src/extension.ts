/**
 * Точка входа расширения VS Code «C++ Include Overlapping Detector».
 * @module extension
 */

import * as vscode from 'vscode';
import * as path from 'path'
import * as fs from 'fs';
import { parseIncludes } from './parser';
import { DependencyGraph } from './graph';

/**
 * Точка входа плагина. Активирует расширение и регистрирует команду
 * `cpp-include-overlapping-detector.analyze`.
 *
 * Команда берёт активный файл редактора, рекурсивно (глубиной до 20 уровней)
 * собирает граф его локальных `#include "..."` и ищет в нём циклические
 * зависимости. Результат показывается уведомлением: либо цепочка цикла
 * (пути относительно корня проекта), либо сообщение об отсутствии циклов
 * и число проанализированных файлов.
 *
 * Пути подключаемых файлов указываются относительно каталога файла,
 * в котором встретился `#include`. Файлы, которые не удалось прочитать,
 * пропускаются.
 *
 * @param context Контекст расширения, предоставляемый VS Code; в него
 * добавляется регистрация команды для корректного освобождения ресурсов.
 */
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('cpp-include-overlapping-detector.analyze', () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showWarningMessage('Откройте C++ файл для анализа');
            return;
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Откройте папку проекта');
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const startFile = editor.document.uri.fsPath;
        const graph: DependencyGraph = new DependencyGraph();
        const processed: Set<string> = new Set<string>();

        const scanFile = (filePath: string, depth: number) => {
            if (depth > 20 || processed.has(filePath)) {
				return;
			}
            processed.add(filePath);

            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const includes = parseIncludes(content);

                for (const include of includes) {
                    const normalizedPath = path.normalize(path.join(path.dirname(filePath), include));

                    graph.addEdge(filePath, normalizedPath);
                    scanFile(normalizedPath, depth + 1);
                }
            } catch { }
        };

        scanFile(startFile, 0);

        const cycle = graph.findCycle(startFile);

        if (cycle) {
			let readable = '';
			for (let i = 0; i < cycle.length; ++i) {
				const shortPath = path.relative(rootPath, cycle[i]);
				if (i === 0) {
					readable = shortPath;
				} else {
					readable += ' -> ' + shortPath;
				}
			}

            vscode.window.showErrorMessage(`Обнаружен цикл: ${readable}`);
        } else {
            vscode.window.showInformationMessage(`Циклов нет. Проанализировано файлов: ${graph.nodeCount()}`);
        }
    });

    context.subscriptions.push(disposable);
}

/**
 * Вызывается при деактивации расширения. Освобождение ресурсов
 * выполняется автоматически через `context.subscriptions`.
 */
export function deactivate() {}