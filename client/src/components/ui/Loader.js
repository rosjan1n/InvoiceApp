import loadingImage from '../../assets/images/loading.svg';

const Loader = () => {
  return (
    <div className="w-full pt-10 flex flex-col justify-center items-center">
      <img src={loadingImage} />
    </div>
  );
};

export default Loader;
