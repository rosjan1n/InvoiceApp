import loadingImage from '../../assets/images/loading.svg';

const Loader = () => {
  return (
    <div className="w-[90%] m-auto gap-16 pt-10 flex flex-col justify-center items-center">
      <h1 className='font-bold text-3xl'>Trwa wczytywanie danych...</h1>
      <img src={loadingImage} />
    </div>
  );
};

export default Loader;
