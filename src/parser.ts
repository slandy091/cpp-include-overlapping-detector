/**
 * Модуль разбора C++ файлов: поиск `#include`.
 * @module parser
 */
 
/**
 * Находит все локальные подключения (`#include "..."`) в тексте C++ файла.
 *
 * Перед поиском из текста удаляются комментарии, поэтому закомментированные
 * подключения игнорируются. Системные подключения вида `#include <...>` не
 * учитываются.
 *
 * @param content Полный текст C++ файла.
 * @returns Массив путей из `#include "..."` в порядке появления в файле
 *
 * @example
 * ```ts
 * parseIncludes('#include "a.h"\n// #include "b.h"\n#include <vector>');
 * // => ['a.h']
 * ```
 */
export function parseIncludes(content: string): string[] {
    const includes: string[] = [];
    const lines: string[] = cleanFile(content).split('\n');

    for(let line of lines) {
        const found = line.match(/^\s*#\s*include\s*"([^"]+)"/);

        if (found) {
            includes.push(found[1]);
        }
    }

    return includes;
}

/**
 * Удаляет из текста C++ файла все комментарии (`//...` и `/*...*\/`).
 *
 * Отслеживает, находится ли текущий символ внутри строки, символьного литерала
 * или блочного комментария. Последовательности `//` и `/*` внутри литералов не считаются
 * комментариями, экранированные символы (`\"`, `\'`) обрабатываются.
 * Переводы строк внутри однострочных комментариев сохраняются.
 *
 * @param content Исходный текст файла.
 * @returns Текст файла без комментариев.
 */
function cleanFile(content: string): string {
    let result = '';
    let i = 0;
    
    let inString: boolean = false;
    let inChar: boolean = false;
    let inComment: boolean = false;

    while (i < content.length) {
        if (inComment) {
            if (content[i] === '*' && content[i + 1] === '/') {
                inComment = false;
                i += 2;
            } else {
                ++i;
            }
            continue;
        }

        if (inString) {
            if (content[i] === '\\') { // для обработки \"
                result += content[i] + (content[i + 1] || '');
                i += 2;
                continue;
            }
            if (content[i] === '"') {
                inString = false;
            }
            result += content[i];
            ++i;
            continue;
        }

        if (inChar) {
            if (content[i] === '\\') {
                result += content[i] + (content[i + 1] || '');
                i += 2;
                continue;
            }
            if (content[i] === "'") {
                inChar = false;
            }
            result += content[i];
            ++i;
            continue;
        }

        if (content[i] === '"') {
            inString = true;
            result += content[i];
            ++i;
            continue;
        }
        
        if (content[i] === "'") {
            inChar = true;
            result += content[i];
            ++i;
            continue;
        }

        if (content[i] === '/' && content[i + 1] === '/') {
            while (i < content.length && content[i] !== '\n') {
                ++i;
            }
            continue;
        }

        if (content[i] === '/' && content[i + 1] === '*') {
            inComment = true;
            i += 2;
            continue;
        }

        result += content[i];
        ++i;
    }

    return result;
}