import "./MovieList.css";
import Fire from "../../assets/fire.png";
import Top from "../../assets/top.png";
import MovieCard from "./MovieCard";
import { useEffect } from "react";
import { useState } from "react";
import _, { filter } from "lodash";

export default function MovieList({ type, title, emoji }) {
  const [movies, setMovies] = useState([]);
  const [filterMovies, setFilterMovies] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState({
    by: "default",
    order: "asc",
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // console.log(sort);

  const fetchMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${type}?api_key=a8b99f09d8bf03be7a4a14b36598a467&language=ko`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        setFilterMovies(data.results);
      })
      .catch((err) => console.log(err));
  };

  const handleFilter = (rate) => {
    if (minRating === rate) {
      setMinRating(0);
      setFilterMovies(movies);
    } else {
      setMinRating(rate); // 입력된 평점을 일단 스테이트 저장
      // filter 는 ()괄호안에 참인거만 통과시킴
      const filtered = movies.filter((movie) => movie.vote_average >= rate);
      setFilterMovies(filtered);
    }
  };

  // sort 값일 업데이트 될때마다 실행
  useEffect(() => {
    if (sort.by !== "default") {
      const sortedMovies = _.orderBy(filterMovies, [sort.by], [sort.order]);
      setFilterMovies(sortedMovies);
    }
  }, [sort]);

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <section id={`${type}`} className="movie_list">
      <header className="align_center movie_list_header">
        <h2 className="align_center movie_list_heading">
          {title} <img src={emoji} alt="fire emoji" className="navbar_emoji" />
        </h2>

        <div className="align_center movie_list_fs">
          <ul className="align_center movie_filter">
            <li
              className={
                minRating === 8
                  ? "movie_filter_item active"
                  : "movie_filter_item"
              }
              onClick={() => handleFilter(8)}
            >
              8+ Star
            </li>
            <li
              className={
                minRating === 7
                  ? "movie_filter_item active"
                  : "movie_filter_item"
              }
              onClick={() => handleFilter(7)}
            >
              7+ Star
            </li>
            <li
              className={
                minRating === 6
                  ? "movie_filter_item active"
                  : "movie_filter_item"
              }
              onClick={() => handleFilter(6)}
            >
              6+ Star
            </li>
          </ul>

          <select
            name="by"
            id=""
            onChange={handleSort}
            className="movie_sorting"
          >
            <option value="default">SortBy</option>
            <option value="release_date">Date</option>
            <option value="vote_average">Rating</option>
          </select>
          <select
            name="order"
            id=""
            onChange={handleSort}
            className="movie_sorting"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </header>

      <div className="movie_cards">
        {filterMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <button type="button" onClick={handleClick} className="topBtn">
        <img src={Top}></img>
      </button>
    </section>
  );
}
