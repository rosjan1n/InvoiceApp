import Map, { NavigationControl } from "react-map-gl";
import maplibregl from "maplibre-gl";

const API_KEY = "lrSPvEBB773dRCBe8TvK";

function BuildMap(props) {
  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    const apiUrl = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${API_KEY}`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        var address = "",
          postal_code = "",
          city = "";
        for (let index = 0; index < data["features"].length - 1; index++) {
          if (data.features[index].properties["country_code"] !== "pl") return;
          if (data.features[index].id.includes("place"))
            city = data.features[index].text;
          if (data.features[index].id.includes("municipal_district"))
            city = data.features[index].text;
          if (data.features[index].id.includes("municipality"))
            if(city === "")
              city = data.features[index].text;
          if (data.features[index].id.includes("county"))
            if(city === "")
              city = data.features[index].text;
          if (data.features[index].id.includes("postal_code"))
            postal_code = data.features[index].text;
          if (data.features[index].id.includes("address")) {
            var additional = data.features[index].address;
            if (additional)
              address = `${data.features[index].text} ${additional}`;
            else address = `${data.features[index].text}`;
          }
        }
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
      style={{ width: "100%", height: "70vh" }}
      mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`}
      onClick={handleMapClick}
    ></Map>
  );
}

export default BuildMap;
