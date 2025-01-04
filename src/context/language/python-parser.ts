import { AbstractParser, EnclosingContext } from "../../constants";
import traverse, { NodePath, Node } from "@babel/traverse";
import { SyntaxNode } from "tree-sitter";

const Python = require("tree-sitter-python");

const parser = new Parser();
parser.setLanguage(Python);

const processNode = (
  node: SyntaxNode,
  lineStart: number,
  lineEnd: number,
  largestSize: number,
  largestEnclosingContext: SyntaxNode | null
) => {
  const start = node.startPosition;
  const end = node.endPosition;



  return { largestSize, largestEnclosingContext };
};

export class PythonParser implements AbstractParser {
    lineEnd: number
  ): EnclosingContext {
    const tree = parser.parse(file);
    let largestEnclosingContext: SyntaxNode | null = null;
    let largestSize = 0;

    const cursor = tree.walk();
    let first = true;
    while (first || cursor.gotoNextSibling() || cursor.gotoParent()) {
      const node = cursor.currentNode;
      const node_types = ["function_definition", "class_definition", "module"];
      if (node_types.includes(node.type)) {
        ({ largestSize, largestEnclosingContext } = processNode(
          node,
          lineStart,
          lineEnd,
          largestSize,
          largestEnclosingContext
        ));
      }
      first = false;
    }
    return { enclosingContext: largestEnclosingContext } as EnclosingContext;
  }

  dryRun(file: string): { valid: boolean; error: string } {
    try {
      const tree = parser.parse(file);
      return {
        valid: true,
        error: "",
      };
    } catch (exc) {
      return {
        valid: false,
        error: exc,
      };
    }
  }
}

