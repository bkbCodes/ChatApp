import React, { useContext, useEffect, useState } from "react";

import { Editor, EditorState, RichUtils, Modifier, convertToRaw } from "draft-js";
import { Picker } from "emoji-mart";
// import "emoji-mart/css/emoji-mart.css";
import {
  BiAt,
  BiBold,
  BiCode,
  BiCodeBlock,
  BiItalic,
  BiLink,
  BiListOl,
  BiListUl,
  BiSend,
  BiStrikethrough,
  BiUnderline,
  BiUnlink,
  BiUpload,
} from "react-icons/bi";
import { BsEmojiSmile, BsQuote } from "react-icons/bs";
import "draft-js/dist/Draft.css";
import { MyContext } from "../Context/ChatContext";
import axios from "axios";
import { convertToHTML } from "draft-convert";

const CustomEditor = () => {
  const {
    userId,
    userName,
    authToken,
    groupId,
    groupName,
    setGroupId,
    setUserName,
    setGroupName,
    setAuthToken,
  } = useContext(MyContext);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const handleItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  };

  const handleUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  };

  const handleStrikethroughClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH"));
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    const selection = editorState.getSelection();
    const url = window.prompt("Enter link URL:", "https://");
    if (!url) {
      setEditorState(EditorState.forceSelection(editorState, selection));
      return;
    }
    const content = editorState.getCurrentContent();
    const contentWithLink = Modifier.applyInlineStyle(
      content,
      selection,
      "LINK"
    );
    const newEditorStateWithLink = EditorState.push(
      editorState,
      contentWithLink,
      "change-inline-style"
    );
    let entityKey = contentWithLink.getEntityAt(selection.getStartOffset());
    if (entityKey) {
      const url = contentWithLink.getEntity(entityKey).getData().url;
      setEditorState(newEditorStateWithLink);
      return;
    }
    const contentWithEntity = contentWithLink.createEntity("LINK", "MUTABLE", {
      url,
    });
    const newEditorStateWithEntity = EditorState.push(
      newEditorStateWithLink,
      contentWithEntity,
      "create-entity"
    );
    entityKey = contentWithEntity.getLastCreatedEntityKey();
    const contentWithUpdatedLink = Modifier.applyEntity(
      contentWithEntity,
      selection,
      entityKey
    );
    const newEditorStateWithUpdatedLink = EditorState.push(
      newEditorStateWithEntity,
      contentWithUpdatedLink,
      "apply-entity"
    );
    setEditorState(
      EditorState.forceSelection(
        newEditorStateWithUpdatedLink,
        newEditorStateWithUpdatedLink.getCurrentContent().getSelectionAfter()
      )
    );
  };

  const handleUnlinkClick = () => {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    const entityKey = block.getEntityAt(selection.getStartOffset());

    if (entityKey) {
      const entity = content.getEntity(entityKey);
      if (entity.getType() === "LINK") {
        const newContent = content.mergeEntityData(entityKey, {
          url: undefined,
        });
        const newEditorState = EditorState.push(
          editorState,
          newContent,
          "apply-entity"
        );
        setEditorState(RichUtils.toggleLink(newEditorState, selection, null));
      }
    }
  };

  // Add an unordered list to the editor
  const handleUnorderedList = () => {
    const newEditorState = RichUtils.toggleBlockType(
      editorState,
      "unordered-list-item"
    );
    setEditorState(newEditorState);
  };

  // Add an ordered list to the editor
  const handleOrderedList = () => {
    const newEditorState = RichUtils.toggleBlockType(
      editorState,
      "ordered-list-item"
    );
    setEditorState(newEditorState);
  };

  // Add a blockquote to the editor
  const handleBlockquote = () => {
    const newEditorState = RichUtils.toggleBlockType(editorState, "blockquote");
    setEditorState(newEditorState);
  };

  // Add a code snippet to the editor
  const handleCodeSnippet = () => {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, "CODE");
    setEditorState(newEditorState);
  };

  // Add a code block to the editor
  const handleCodeBlock = () => {
    const newEditorState = RichUtils.toggleBlockType(editorState, "code-block");
    setEditorState(newEditorState);
  };

  const handleFileUpload = () => {
    const inputFile = document.createElement("input");
    inputFile.setAttribute("type", "file");
    inputFile.setAttribute("accept", "image/*");
    inputFile.onchange = () => {
      const file = inputFile.files[0];
      // Code for uploading file to server/database
      const imgUrl = "http://example.com/image.jpg"; // Replace with actual URL of uploaded file
      const image = document.createElement("img");
      image.src = imgUrl;
      document.execCommand("insertHTML", false, image.outerHTML);
    };
    inputFile.click();
  };

  const handleMention = () => {
    const name = prompt("Enter the username: ");
    const mention = "@" + name; // Replace with actual username or handle
    document.execCommand("insertText", false, mention);
  };

  const [value, setValue] = useState("");

  function htmlToPlainText(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText;
  }

  const handleSubmit = () => {
    const contentState = editorState.getCurrentContent();
    const time = Date.now()
    const plainText = htmlToPlainText(convertToHTML(contentState));
    console.log(plainText)

    axios
    .post("/group/send/"+groupId, {
      fromUser: userId,
      text: plainText,
      time: time,
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="p-3 rounded-lg border border-gray-400 flex gap-2 flex-col">
      <div className="flex">
        <div className="flex gap-2 border-r-2 border-gray-700 px-2">
          <button onClick={handleBoldClick}>
            <BiBold />
          </button>
          <button onClick={handleItalicClick}>
            <BiItalic />
          </button>
          <button onClick={handleUnderlineClick}>
            <BiUnderline />
          </button>
          <button onClick={handleStrikethroughClick}>
            <BiStrikethrough />
          </button>
        </div>
        <div className="flex gap-2 border-r-2 border-gray-700 px-2">
          <button onClick={handleLinkClick}>
            <BiLink />
          </button>
          <button onClick={handleUnlinkClick}>
            <BiUnlink />
          </button>
        </div>
        <div className="flex gap-2 border-r-2 border-gray-700 px-2">
          <button onClick={handleUnorderedList}>
            <BiListUl />
          </button>
          <button onClick={handleOrderedList}>
            <BiListOl />
          </button>
          <button onClick={handleBlockquote}>
            <BsQuote />
          </button>
        </div>
        <div className="flex gap-2 border-r-2 border-gray-700 px-2">
          <button onClick={handleCodeSnippet}>
            <BiCode />
          </button>
          <button onClick={handleCodeBlock}>
            <BiCodeBlock />
          </button>
        </div>
      </div>
      <div className="max-h-[10vh] overflow-y-scroll">
      <Editor editorState={editorState} onChange={handleEditorChange}/>
      </div>
      <div className="bottom flex justify-between">
        <div className="flex gap-2 border-r-2 border-gray-700 px-2">
          <button onClick={handleMention}>
            <BiAt />
          </button>
          <button onClick={handleFileUpload}>
            <BiUpload />
          </button>
          <button onClick={toggleEmojiPicker}>
            <BsEmojiSmile />
          </button>
        </div>
        <button onClick={handleSubmit} className="bg-green-600 px-2 pr-4 py-1 rounded-md"><BiSend /></button>
      </div>
    </div>
  );
};

export default CustomEditor;
