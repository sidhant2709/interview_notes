import { useState } from 'react';
import './App.css';
// import Folder from './components/Folder';
import explorer from './data/folderData';
import FolderWithStyle from './components/FolderWithStyle';
import useTraverseTree from './hooks/useTraverseTree';

function App() {
  const [foldersData, setFoldersData] = useState(explorer);

  const { insertNode } = useTraverseTree();

  const handleInsertNode = (folderId, item, isFolder) => {
    const finalTree = insertNode(foldersData, folderId, item, isFolder);

    setFoldersData(finalTree);
  };

  return (
    <div className="App">
      <FolderWithStyle explorer={foldersData} handleInsertNode={handleInsertNode} />
    </div>
  );
}

export default App;
