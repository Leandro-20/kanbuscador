const axios = require('axios').default
const https = require('https')

const getGeonodeResult = ({url, filterProperty, text, layerName, httpsPermission}) => {
    return axios({
        url: `${url}`,
        data: `
    <wfs:GetFeature service="WFS" version="1.1.0" xmlns:gml="http://www.opengis.net/gml" xmlns:wfs="http://www.opengis.net/wfs" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" startIndex="0" maxFeatures="20">
            <wfs:Query typeName="${layerName}" srsName="EPSG:4326">
                <wfs:SortBy>
                    <wfs:SortProperty>
                        <ogc:PropertyName>numero_obr</ogc:PropertyName>
                        <wfs:SortOrder>A</wfs:SortOrder>
                    </wfs:SortProperty>
                </wfs:SortBy>
                <ogc:Filter>
                    <ogc:And>
                        <ogc:And>
                            <ogc:And>
                                <ogc:PropertyIsLike matchCase="false" wildCard="*" singleChar="." escapeChar="u0021">
                                    <ogc:PropertyName>${filterProperty}</ogc:PropertyName>
                                    <ogc:Literal>*${text}*</ogc:Literal>
                                </ogc:PropertyIsLike>
                            </ogc:And>
                        </ogc:And>
                    </ogc:And>
                </ogc:Filter>
            </wfs:Query>
        </wfs:GetFeature>
   `,
        headers: {
            'Content-Type': 'application/xml'
        },
        method: 'POST',
        httpsAgent: new https.Agent({ rejectUnauthorized: httpsPermission })
    })
}
const getNominatimResult = ({text, city}) => {
    return axios({
    url:`https://nominatim.openstreetmap.org/search.php?street=${text}&city=${city}&country=Argentina&bounded=1&format=geojson`
})
}

const buscador = async ({url, filterProperty, text, layerName, title, type= 'geonode', httpsPermission= false, city }) => {
    let result
    switch (type) {
        case 'nominatim':
            result = await getNominatimResult({text, city})
          break;
        case 'geonode':
            result = await getGeonodeResult({url, filterProperty, text, layerName, httpsPermission})
      }
    return {title, result:result.data.features}
}
  exports.buscador = buscador

const multiBuscador = async (data) => {
    const resultados = await Promise.all(data.map((elemento) => buscador(elemento)))
    return resultados
}
exports.multiBuscador = multiBuscador

// let text = 'mitre'
// multiBuscador([{
//     url: 'https://visor.obraspublicas.gob.ar/gs/ows?service=WFS&outputFormat=json', filterProperty: 'id_obra', text, title: 'obras', layerName: 'geonode:Obras_y_proyectos_puntuales_visorgeomop'
//   }, {
//     url: 'https://visor.obraspublicas.gob.ar/gs/ows?service=WFS&outputFormat=json', filterProperty: 'nombre_obr', text, title: 'obras', layerName: 'geonode:Obras_y_proyectos_puntuales_visorgeomop'
//   }, {
//     url: 'https://visor.obraspublicas.gob.ar/gs/ows?service=WFS&outputFormat=json', filterProperty: 'id_proyect', text, title: 'obras', layerName: 'geonode:Obras_y_proyectos_puntuales_visorgeomop'
//   }, {
//     text, type: 'nominatim', title: 'lugar'
//   }]).then((data)=> data.map(({title, result})=> console.log({title, result})))

// buscador({text: 'julio', city: 'San Luis', type:'nominatim' })
// .then(({ title, result }) => {console.log({title,result})})


