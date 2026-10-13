[**C++ Include Overlapping Detector**](../../README.md)

***

[C++ Include Overlapping Detector](../../README.md) / [graph](../README.md) / DependencyGraph

# Class: DependencyGraph

Defined in: graph.ts:12

Ориентированный граф зависимостей между файлами.

Вершина — путь к файлу, ребро `A -> B` означает, что файл `A`
подключает файл `B` через `#include`.

## Constructors

### Constructor

> **new DependencyGraph**(): `DependencyGraph`

#### Returns

`DependencyGraph`

## Properties

### edges

> `private` **edges**: `Map`\<`string`, `Set`\<`string`\>\>

Defined in: graph.ts:14

Список смежности: файл -> множество файлов, которые он подключает.

## Methods

### addEdge()

> **addEdge**(`from`, `to`): `void`

Defined in: graph.ts:23

Добавляет в граф ребро «`from` подключает `to`».
Повторное добавление того же ребра игнорируется.

#### Parameters

##### from

`string`

Путь к подключающему файлу.

##### to

`string`

Путь к подключаемому файлу.

#### Returns

`void`

***

### findCycle()

> **findCycle**(`startNode`): `string`[] \| `null`

Defined in: graph.ts:52

Ищет цикл в графе поиском в глубину, начиная с заданной вершины.

Обходятся только вершины, достижимые из `startNode`. Возвращается
первый найденный цикл.

#### Parameters

##### startNode

`string`

Вершина, с которой начинается обход.

#### Returns

`string`[] \| `null`

Цепочка вершин цикла, у которой первый и последний элементы
совпадают (например, `['a.h', 'b.h', 'a.h']`), либо `null`,
если достижимых циклов нет.

***

### nodeCount()

> **nodeCount**(): `number`

Defined in: graph.ts:37

Возвращает количество вершин, у которых есть хотя бы одно исходящее ребро,
то есть число файлов, содержащих локальные `#include`.

#### Returns

`number`

Количество вершин с исходящими рёбрами.
