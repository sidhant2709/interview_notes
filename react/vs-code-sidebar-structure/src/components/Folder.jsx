import React, { useState } from 'react';

// import { AiFillFolderAdd, AiFillFileAdd } from 'react-icons/ai';

function Folder({ explorer }) {
  const [expand, setExpand] = useState(false);

  if (explorer.isFolder) {
    return (
      <div>
        <span onClick={() => setExpand(!expand)}>
          {explorer.name}
          <br />
        </span>

        <div style={{ display: expand ? 'block' : 'none', paddingLeft: '15px' }}>
          {explorer.items.map(exp => {
            return <Folder explorer={exp} key={exp.id} />;
          })}
        </div>
      </div>
    );
  } else {
    return (
      <span>
        {explorer.name}
        <br />
      </span>
    );
  }
}

export default Folder;
