import React, { useState } from 'react';
import { AiFillFolderAdd, AiFillFileAdd } from 'react-icons/ai';

function FolderWithStyle({ explorer, handleInsertNode }) {
  const [expand, setExpand] = useState(false);

  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: null,
  });

  const handleNewFolder = (e, isFolder) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
    });
  };

  const onAddFolder = e => {
    if (e.keyCode === 13 && e.target.value) {
      handleInsertNode(explorer.id, e.target.value, showInput.isFolder);
      setShowInput({ ...showInput, visible: false });
    }
  };

  if (explorer.isFolder) {
    return (
      <div style={{ marginTop: 5 }}>
        <div className="folder" onClick={() => setExpand(!expand)}>
          <span>📁 {explorer.name}</span>
          <div>
            <button>
              <AiFillFolderAdd onClick={e => handleNewFolder(e, true)} />
            </button>
            <button>
              <AiFillFileAdd onClick={e => handleNewFolder(e, false)} />
            </button>
          </div>
        </div>

        <div style={{ display: expand ? 'block' : 'none', paddingLeft: '15px' }}>
          {showInput.visible && (
            <div className="inputContainer">
              <span>{showInput.isFolder ? '📁' : '📃'}</span>
              <input
                className="inputContainer__input"
                autoFocus
                type="text"
                onBlur={() => setShowInput({ ...showInput, visible: false })}
                onKeyDown={onAddFolder}
              />
            </div>
          )}
          {explorer.items.map(exp => {
            return <FolderWithStyle explorer={exp} key={exp.id} handleInsertNode={handleInsertNode} />;
          })}
        </div>
      </div>
    );
  } else {
    return <span className="file">📃 {explorer.name}</span>;
  }
}

export default FolderWithStyle;
