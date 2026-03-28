import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FcNext, FcPrevious } from 'react-icons/fc';
import Loader from './Loader';

const auth = '563492ad6f91700001000001796a2f8e7d8d41999574abe8c28e8046';

const config = {
  headers: {
    Accept: 'application/json',
    Authorization: auth,
  },
};

function ApiPagination() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const generatePictures = useCallback(
    async page => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://api.pexels.com/v1/curated/?per_page=5&page=${page}`, config);
        setPhotos(response.data.photos);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    [page]
  );

  const selectPageHandler = selectedPage => {
    if (selectedPage >= 1) {
      setPage(selectedPage);
    }
  };

  useEffect(() => {
    generatePictures(page);
  }, [generatePictures]);

  return (
    <div className="App">
      <header>
        <h2>React Api Pagination</h2>
      </header>
      <main>
        <div className={isLoading ? 'loading' : 'gallery'}>
          {isLoading ? (
            <Loader />
          ) : (
            photos.map(photo => {
              return (
                <div className="gallery-img" key={photo.id}>
                  <div className="gallery-info">
                    <p>{photo.photographer.split(' ').slice(0, 2).join(' ')}</p>
                    <a href={photo.src.original}>Download</a>
                  </div>
                  <img src={photo.src.large} alt={photo.photographer_id} />
                </div>
              );
            })
          )}
        </div>
      </main>

      {photos.length > 0 && (
        <footer>
          <button onClick={() => selectPageHandler(page - 1)} className={page > 1 ? '' : 'disable'}>
            <FcPrevious size={50} />
          </button>

          <button className={page > 1 ? '' : 'disable'} onClick={() => selectPageHandler(page - 1)}>
            {page > 1 ? page - 1 : 1}
          </button>

          <button className={page ? 'active' : ''} onClick={() => selectPageHandler(page)}>
            {page}
          </button>

          <button className={page >= 1 ? '' : 'disable'} onClick={() => selectPageHandler(page + 1)}>
            {page + 1}
          </button>

          <button onClick={() => selectPageHandler(page + 1)}>
            <FcNext size={50} />
          </button>
        </footer>
      )}
    </div>
  );
}

export default ApiPagination;

// className={page < photos.length / 5 ? '' : 'disable'}
