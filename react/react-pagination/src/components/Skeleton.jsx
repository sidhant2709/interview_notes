import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { FcNext, FcPrevious } from 'react-icons/fc';

const auth = '563492ad6f91700001000001796a2f8e7d8d41999574abe8c28e8046';

const config = {
  headers: {
    Accept: 'application/json',
    Authorization: auth,
  },
};

function App() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);

  const generatePictures = async () => {
    const response = await axios.get(`https://api.pexels.com/v1/curated/?per_page=80`, config);
    setPhotos(response.data.photos);
    console.log(response.data.photos);
  };

  const selectPageHandler = selectedPage => {
    if (selectedPage >= 1 && selectedPage <= photos.length / 5 && selectedPage !== page) {
      setPage(selectedPage);
    }
  };

  useEffect(() => {
    generatePictures();
  }, []);

  return (
    <div className="App">
      <header>
        <h2>React Pagination</h2>
      </header>
      <main>
        <div className="gallery">
          <div className="gallery-img">
            <div className="gallery-info">
              <p>Gülru Sude</p>
              <a href="https://images.pexels.com/photos/15948114/pexels-photo-15948114.jpeg">Download</a>
            </div>
            <img
              src="https://images.pexels.com/photos/15948114/pexels-photo-15948114.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Gülru Sude"
            />
          </div>

          <div className="gallery-img">
            <div className="gallery-info">
              <p>Gülru Sude</p>
              <a href="https://images.pexels.com/photos/15948114/pexels-photo-15948114.jpeg">Download</a>
            </div>
            <img
              src="https://images.pexels.com/photos/15948114/pexels-photo-15948114.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Gülru Sude"
            />
          </div>

          <div className="gallery-img">
            <div className="gallery-info">
              <p>Gülru Sude</p>
              <a href="https://images.pexels.com/photos/15948114/pexels-photo-15948114.jpeg">Download</a>
            </div>
            <img
              src="https://images.pexels.com/photos/15948114/pexels-photo-15948114.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Gülru Sude"
            />
          </div>

          <div className="gallery-img">
            <div className="gallery-info">
              <p>Gülru Sude</p>
              <a href="https://images.pexels.com/photos/15948114/pexels-photo-15948114.jpeg">Download</a>
            </div>
            <img
              src="https://images.pexels.com/photos/15948114/pexels-photo-15948114.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Gülru Sude"
            />
          </div>

          <div className="gallery-img">
            <div className="gallery-info">
              <p>Gülru Sude</p>
              <a href="https://images.pexels.com/photos/15948114/pexels-photo-15948114.jpeg">Download</a>
            </div>
            <img
              src="https://images.pexels.com/photos/15948114/pexels-photo-15948114.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Gülru Sude"
            />
          </div>
        </div>
      </main>
      <footer>
        <button>
          <FcPrevious size={50} />
        </button>

        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>

        <button>
          <FcNext size={50} />
        </button>
      </footer>
    </div>
  );
}

export default App;
