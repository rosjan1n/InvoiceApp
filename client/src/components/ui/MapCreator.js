import Map from "react-map-gl";
import maplibregl from "maplibre-gl";

const API_KEY = "lrSPvEBB773dRCBe8TvK";

function BuildMap(props) {
  const getCity = (f) => {
    const index = f.findIndex(element => (element.id.includes("municipal_district") || element.id.includes("place") || element.id.includes("county")));
    if(index)
      return f[index].text;
    return false;
  };

  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    const apiUrl = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${API_KEY}&types=address,postal_code,county,municipal_district`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        var address = "",
          postal_code = "",
          city = getCity(data.features) || "";
        data.features.forEach((f) => {
          if (f.properties["country_code"] !== "pl") return;

          if (f.id.includes("postal_code")) postal_code = f.text;
          if (f.id.includes("address")) {
            var additional = f.address;
            if (additional) address = `${f.text} ${additional}`;
            else address = `${f.text}`;
          }
        });
        props.onClick({ address, postal_code, city });
      });
  };

  return (
    <Map
      mapLib={maplibregl}
      initialViewState={{
        latitude: 52.22977,
        longitude: 21.01178,
        zoom: 10,
      }}
      style={{ width: "100%", height: "70vh", border: "1px", borderRadius: "200px" }}
      mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`}
      onClick={handleMapClick}
    ></Map>
  );
}

export default BuildMap;
