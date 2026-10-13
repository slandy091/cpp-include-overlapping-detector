[**C++ Include Overlapping Detector**](../../README.md)

***

[C++ Include Overlapping Detector](../../README.md) / [parser](../README.md) / parseIncludes

# Function: parseIncludes()

> **parseIncludes**(`content`): `string`[]

Defined in: parser.ts:22

Находит все локальные подключения (`#include "..."`) в тексте C++ файла.

Перед поиском из текста удаляются комментарии, поэтому закомментированные
подключения игнорируются. Системные подключения вида `#include <...>` не
учитываются.

## Parameters

### content

`string`

Полный текст C++ файла.

## Returns

`string`[]

Массив путей из `#include "..."` в порядке появления в файле

## Example

```ts
parseIncludes('#include "a.h"\n// #include "b.h"\n#include <vector>');
// => ['a.h']
```
