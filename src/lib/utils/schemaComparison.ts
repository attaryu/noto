import type { JSONContent } from '@tiptap/core';

export const schemaComparison = (schema1: JSONContent, schema2: JSONContent) =>
	JSON.stringify(schema1) === JSON.stringify(schema2);
