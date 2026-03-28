const explorer = {
  id: 1,
  name: 'root',
  isFolder: true,
  items: [
    {
      id: 2,
      name: 'public',
      isFolder: true,
      items: [
        {
          id: 3,
          name: 'public nested 1',
          isFolder: true,
          items: [
            {
              id: 4,
              name: 'index.html',
              isFolder: false,
            },
            {
              id: 5,
              name: 'app.js',
              isFolder: false,
            },
            {
              id: 6,
              name: 'style.csss',
              isFolder: false,
            },
          ],
        },
        {
          id: 7,
          name: 'public_nested_file',
          isFolder: false,
        },
      ],
    },
    {
      id: 8,
      name: 'src',
      isFolder: true,
      items: [
        {
          id: 9,
          name: 'Index.html',
          isFolder: false,
        },
        {
          id: 10,
          name: 'App.js',
          isFolder: false,
        },
        {
          id: 11,
          name: 'Style.csss',
          isFolder: false,
        },
      ],
    },
    {
      id: 12,
      name: 'package.json',
      isFolder: false,
    },
  ],
};

export default explorer;
