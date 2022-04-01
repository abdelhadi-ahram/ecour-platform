import React, {useMemo, useState, useCallback} from "react";
import { withReact, useSlate, Slate, Editable  } from 'slate-react';
import { withHistory } from 'slate-history';
import ColorPicker from "./ColorPicker"
import BlockCode from "./BlockCode"
import SoftBreak from 'slate-soft-break'


import {
  Editor,
  createEditor,
  Node,
  Path,
  Transforms,
  Element as SlateElement
} from 'slate';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {faBold, faItalic, faUnderline,faCode,
  faQuoteLeft, faListUl, faListOl, faImage, faHeading, faBroom
} from '@fortawesome/free-solid-svg-icons'


const MARK_BUTTONS = [
  {icon : faBold, format : "bold"},
  {icon : faItalic, format : "italic"},
  {icon : faUnderline, format : "underline"},
  {icon : faCode, format : "code"}
]

const LIST_TYPES = ['bulleted-list', 'numbered-list'];
const BLOCK_BUTTONS = [
  {icon : faQuoteLeft, format : "block-quote"},
  {icon : faListUl, format : "bulleted-list"},
  {icon : faListOl, format : "numbered-list"},
  {icon : faImage, format : "image"},
  {icon : faHeading, format : "heading-one"}
]


const TextEditor = ({ value, setValue, height}) => {
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);

  const { isVoid, deleteBackward } = editor
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const renderElement = useCallback(props => <Element {...props} />, []);

  editor.deleteBackward = (...args) => {
    const parentPath = Path.parent(editor.selection.focus.path);
    const parentNode = Node.get(editor, parentPath);

    if (isVoid(parentNode) || !Node.string(parentNode).length) {
      Transforms.removeNodes(editor, { at: parentPath });
    } else {
      deleteBackward(...args);
    }
  }


  return(
    <div className="flex flex-col justify-center my-2">
      <div className="">
        <Slate editor={editor} value={value} onChange={setValue} >

          <div style={{height}} className={"border boredr-gray-200 dark:border-zinc-700 p-2 hover:border-gray-300 dark:hover:border-zinc-600 rounded-md"}>
            <Editable
              className="dark:text-gray-200 w-full h-full overflow-y-auto"
              renderLeaf={renderLeaf}
              placeholder="Type some text.."
              renderElement={renderElement}
              onKeyDown={(e) => {
                if(e.keyCode === 13 && e.shiftKey === false){
                  if( isBlockActive(editor, "block-code") || isBlockActive(editor, "block-quote")  ){
                    e.preventDefault();
                    editor.insertText('\n')
                  }
                }else if(e.keyCode === 13 && e.shiftKey === true){
                  e.preventDefault();
                  const newLine = {
                      type: "paragraph",
                      children: [
                          {
                              text: "",
                              marks: []
                          }
                      ]
                  };
                  Transforms.insertNodes(editor, newLine);
                }
              }}
            />
          </div>

          <div className="flex justify-center items-center rounded border border-gray-200 dark:border-zinc-700 my-2 space-x-2">
            {MARK_BUTTONS.map((item, index) =>{
              return <MarkButton key={`${item}-${index}`} format={item.format} icon={item.icon} />
            })}
            {BLOCK_BUTTONS.map((item, index) =>{
              return <BlockButton key={`${item}-${index}`} format={item.format} icon={item.icon}  />
            })}
            <ColorPicker />
            <button className="font-bold text-gray-400" onMouseDown={() => {toggleBlock(editor,"block-code")}}>{"{ }"}</button>
          </div>

        </Slate>
      </div>
    </div>
  )
}


const isBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

function MarkButton({icon, format}) {
  const editor = useSlate()
  return (
    <button className={`p-1 rounded ${isMarkActive(editor, format) ? " text-purple-500 " : " text-gray-400"}`} onMouseDown={() => {toggleMark(editor,format)}}>
      <FontAwesomeIcon icon={icon}/>
    </button>
  )
}

function BlockButton({icon, format}) {
  const editor = useSlate()
  return (
    <button className={`p-1 rounded ${isBlockActive(editor, format) ? " text-purple-500 " : " text-gray-400"}`} onMouseDown={() => {toggleBlock(editor,format)}}>
      <FontAwesomeIcon icon={icon}/>
    </button>
  )
}

function toggleMark(editor, format){
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}


const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }
  if (leaf.code) {
    children = <span className="font-mono bg-gray-100 text-purple-500">{children}</span>
  }

  return <span {...attributes}>{children}</span>
}


const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote className="my-2 p-2 border-l-4 border-gray-500 rounded-sm bg-gray-100" {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul className="m-2 text-gray-800 p-2 list-disc" {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol className="list-decimal m-2 p-2 text-gray-800" {...attributes}>{children}</ol>;
    case "block-code":
      return <BlockCode {...attributes}>{children}</BlockCode>;
    default:
      return <p {...attributes}>{children}</p>;
  }
}

export default TextEditor;
