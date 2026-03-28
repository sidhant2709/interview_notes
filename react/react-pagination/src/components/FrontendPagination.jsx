import { useState, useEffect } from 'react';
import axios from 'axios';
import { FcNext, FcPrevious } from 'react-icons/fc';

const auth = '563492ad6f91700001000001796a2f8e7d8d41999574abe8c28e8046';

const config = {
  headers: {
    Accept: 'application/json',
    Authorization: auth,
  },
};

function FrontendPagination() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);

  const generatePictures = async () => {
    const response = await axios.get(`https://api.pexels.com/v1/curated/?per_page=80`, config);
    setPhotos(response.data.photos);
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
        <h2>React Front-End Pagination</h2>
      </header>
      <main>
        <div className="gallery">
          {photos.slice(page * 5 - 5, page * 5).map(photo => {
            return (
              <div className="gallery-img" key={photo.id}>
                <div className="gallery-info">
                  <p>{photo.photographer}</p>
                  <a href={photo.src.original}>Download</a>
                </div>
                <img src={photo.src.large} alt={photo.photographer_id} />
              </div>
            );
          })}
        </div>
      </main>

      {photos.length > 0 && (
        <footer>
          <button onClick={() => selectPageHandler(page - 1)} className={page > 1 ? '' : 'disable'}>
            <FcPrevious size={50} />
          </button>

          {[...Array(photos.length / 5)].map((_, i) => {
            return (
              <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => selectPageHandler(i + 1)}>
                {i + 1}
              </button>
            );
          })}

          <button onClick={() => selectPageHandler(page + 1)} className={page < photos.length / 5 ? '' : 'disable'}>
            <FcNext size={50} />
          </button>
        </footer>
      )}
    </div>
  );
}

export default FrontendPagination;
