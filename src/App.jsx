import {useEffect, useState} from "react";
import StarRating from "./StarRating.jsx";

const tempMovieData = [
    {
        imdbID: "tt1375666",
        Title: "Inception",
        Year: "2010",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    },
    {
        imdbID: "tt0133093",
        Title: "The Matrix",
        Year: "1999",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    },
    {
        imdbID: "tt6751668",

        Title: "Parasite",
        Year: "2019",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    },
];

const tempWatchedData = [
    {
        imdbID: "tt1375666",
        Title: "Inception",
        Year: "2010",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
        runtime: 148,
        imdbRating: 8.8,
        userRating: 10,
    },
    {
        imdbID: "tt0088763",
        Title: "Back to the Future",
        Year: "1985",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
        runtime: 116,
        imdbRating: 8.5,
        userRating: 9,
    },
];

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key="c5d18ef7";
export default function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [error,setError]=useState("");
    const [selectId,setSelectId]=useState('tt0088175');

    // useEffect(function (){
    //     console.log("After initial render");
    // },[]);
    // useEffect(function (){
    //     console.log("After every render");
    // });
    // useEffect(function (){
    //     console.log("d")
    // },[query]);
    // console.log("During render");

    // fetch(`http://www.omdbapi.com/?apikey=${key}&s=The Matrix`).then((res)=>res.json()).then((data)=>setMovies(data.Search));

    useEffect(function (){
    async function fetchMovies(){
        try {
            setIsLoading(true);
            setError("");//Reset error
            const res = await fetch(`http://www.omdbapi.com/?apikey=${key}&s=${query}`);
            if (!res.ok) throw new Error("something went wrong with fetching movies");
            const data = await res.json();
            console.log(data);
            if(data.Response==="False") throw new Error("Movie not found!");
            setMovies(data.Search);
            console.log(data.Search);
            setIsLoading(false);

        }catch (err){
            console.error(err.message);
            setError(err.message);
        }finally {
            setIsLoading(false);
        }
        if(query.length<3){
            setMovies([]);
            setError("");
            return;
        }
    }
    fetchMovies();
    },[query]);

    function handleSelectMovie(id){
        setSelectId((selectid)=>id===selectid ? null : id);
    }
    function handleCloseMovie(){
        setSelectId(null);
    }

    function handleAddWatched(movie){
        setWatched(watched=>[...watched,movie])
    }

    function handleDeleteWatched(id){
        setWatched(watched=>watched.filter((movie)=>movie.imdbID !==id))
    }
    return (
        <>
            <Navbar><Search query={query} setQuery={setQuery}/><Numresults movies={movies} /></Navbar>
            <Main >
            <Box>
                {/*{isLoading?<Loader /> : <Movielist movies={movies}/>}*/}
                {!isLoading && !error && <Movielist movies={movies} onSelectMovie={handleSelectMovie}/>}
                {isLoading && <Loader /> }
                {error && <ErrorMessage message={error}/>}
            </Box>
             <Box>
                 {selectId ? (<MovieDetils selectId={selectId} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched} watched={watched}/> ): (
                     <>
                         <WatchedSummary watched={watched}/>
                         <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched} />
                     </>
                 )
                }
             </Box>
            </Main>
        </>
    );
}
function Loader(){
    return(
        <p className="loader">Loading...</p>
    )
}
function ErrorMessage(message){
    return(
        <p className={error}>
            <span>⛔</span>{message}
        </p>

    )
}
function Navbar({children}){
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    )
}

function Logo(){
        return (
             <div className="logo">
             <span role="img">🍿</span>
             <h1>usePopcorn</h1>
             </div>
             )
}
function Search({query,setQuery}) {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    )
}
function Numresults ({movies}){
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    )
}

function Main({children}) {
    return (
        <main className="main">
            {children}
        </main>
    )
}

function Box({children}){
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && (
                children
            )}
        </div>
    )
}

function Movielist({movies,onSelectMovie}){
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie}/>
            ))}
        </ul>
    )
}
function Movie({movie,onSelectMovie}){
    return (
        <li onClick={()=>onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`}/>
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    )
}

// Watchedbox() {
//     const [isOpen2, setIsOpen2] = useState(true);
//     return (
//         <div className="box">
//             <button
//                 className="btn-toggle"
//                 onClick={() => setIsOpen2((open) => !open)}
//             >
//                 {isOpen2 ? "–" : "+"}
//             </button>
//             {isOpen2 && (
//                 <>
//                     <WatchedSummary watched={watched}/>
//                     <WatchedMovieList watched={watched} />
//
//                 </>
//             )}
//         </div>
//     )
// }
function MovieDetils({selectId,onCloseMovie,onAddWatched,watched}){
    const [movie,setmovie]=useState({})
    const [isLoading,setIsLoading]=useState(false)
    const [userRating,setUserRating]=useState('')
    const isWatched=watched.map(movie=>movie.imdbID).includes(selectId);
    const watchedUserRating=watched.find((movie)=>movie.imdID === selectId)?.userRating;
    const {
        Title:title,
        Year:year,
        Poster:poster,
        Runtime:runtime,
        imdbRating,
        Plot:plot,
        Released:released,
        Actors:actors,
        Genre:genre,
        Director:director,
    }=movie;//destructure

    function handleAdd(){
        const newWatchedMovie={
            imdbID:selectId,
            title,
            year,
            poster,
            imdbRating:Number(imdbRating),
            runtime:Number(runtime.split(' ').at(0)),
            userRating,
        }
        onAddWatched(newWatchedMovie)
    }

    useEffect(function (){
        async function getMovieDetails(){
        setIsLoading(true)
            const res=await fetch(
                `http://www.omdbapi.com/?apikey=${key}&i=${selectId}`
            );
            const data=await res.json();
            console.log(data);
            setmovie(data)
            setIsLoading(false)
        }
        getMovieDetails()
    },[selectId]);

useEffect(function (){
    if(!title) return;
    document.title=`Movie | ${title}`;

    return function (){
      document.title="usePopcorn";
        console.log(`clean up effect for movie ${title}`)
    };
},[title]);

    return(
        <div className="details">
            {isLoading ? <Loader /> :
                <>
            <header>
            <button onClick={onCloseMovie}>&larr;</button>
                <img src={poster} alt={`poster of ${movie} movie`}/>
        <div className="details-overview">
            <h2>{title}</h2>
            <p>
                {released} &bull;{runtime}
            </p>
            <p>{genre}</p>
            <p>
                <span>🌟</span>
                {imdbRating} IMDb rating
            </p>
        </div>
            </header>
            <section>
                <div className="rating">
                    {!isWatched ? <><StarRating maxRating={5} size={20} onSetRating={setUserRating}/>
                    {userRating >0 && (<button className="btn-add" onClick={handleAdd}> + Add to list</button>)} </>:
                        <p>you rated with movie {watchedUserRating}
                        <span>🌟</span>
                        </p>}
                </div>
                <p><em>{plot}</em></p>
                <p>Starring {actors}</p>
                <p>Directed by {director}</p>
            </section>
                {selectId}
                </>
                }
        </div>
    )
}
function WatchedSummary({watched}){
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));
    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    )
}

function WatchedMovieList({watched , onDeleteWatched}) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie key={movie.imdbID} movie={movie} onDeleteWatched={{onDeleteWatched}}/>
            ))}
        </ul>
    )
}
function WatchedMovie({movie , onDeleteWatched}){
    return (
        <li >
            <img src={movie.poster} alt={`${movie.title} poster`}/>
            <h3>{movie.title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>

                <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imdbID)}></button>
            </div>
        </li>
    )
}