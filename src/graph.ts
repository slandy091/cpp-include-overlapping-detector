/**
 * Модуль графа зависимостей между файлами.
 * @module graph
 */
 
/**
 * Ориентированный граф зависимостей между файлами.
 *
 * Вершина — путь к файлу, ребро `A -> B` означает, что файл `A`
 * подключает файл `B` через `#include`.
 */
export class DependencyGraph {
    /** Список смежности: файл -> множество файлов, которые он подключает. */
    private edges: Map<string, Set<string>> = new Map();

     /**
     * Добавляет в граф ребро «`from` подключает `to`».
     * Повторное добавление того же ребра игнорируется.
     *
     * @param from Путь к подключающему файлу.
     * @param to Путь к подключаемому файлу.
     */
    addEdge(from: string, to: string): void {
        if(!this.edges.has(from)) {
            this.edges.set(from, new Set());
        }

        this.edges.get(from)!.add(to);
    }

    /**
     * Возвращает количество вершин, у которых есть хотя бы одно исходящее ребро,
     * то есть число файлов, содержащих локальные `#include`.
     *
     * @returns Количество вершин с исходящими рёбрами.
     */
    nodeCount(): number {
        return this.edges.size;
    }

    /**
     * Ищет цикл в графе поиском в глубину, начиная с заданной вершины.
     *
     * Обходятся только вершины, достижимые из `startNode`. Возвращается
     * первый найденный цикл.
     *
     * @param startNode Вершина, с которой начинается обход.
     * @returns Цепочка вершин цикла, у которой первый и последний элементы
     * совпадают (например, `['a.h', 'b.h', 'a.h']`), либо `null`,
     * если достижимых циклов нет.
     */
    findCycle(startNode: string): string[] | null {
        let visited: Set<string> = new Set<string>();
        let path: string[] = [];

        /**
         * Рекурсивный обход. Если сосед уже посещён и находится
         * в текущем пути — найден цикл.
         */
        const dfs = (node: string): string[] | null => {
            visited.add(node);
            path.push(node);

            const neighbors = this.edges.get(node);
            if(neighbors) {
                for(const neighbor of neighbors) {
                    if(!visited.has(neighbor)) {
                        const result = dfs(neighbor);

                        if(result) {
                            return result;
                        }
                    } else if (path.includes(neighbor)) {
                        let cycle: string[] = path.slice(path.indexOf(neighbor));
                        cycle.push(neighbor);

                        return cycle;
                    }
                }
            }

            path.pop();
            return null;
        };

        return dfs(startNode);
    }
}