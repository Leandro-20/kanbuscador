const axios = require('axios').default
const buscador = async ({url, country, text, title}) => {
     const result = await axios({
        url: `${url}`,
        data: `
            <wfs:GetFeature service="WFS" version="1.1.0" xmlns:gml="http://www.opengis.net/gml" xmlns:wfs="http://www.opengis.net/wfs" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" startIndex="0" maxFeatures="20">
                <wfs:Query typeName="geonode:obrasregistradas_acumulado" srsName="EPSG:4326">
                    <wfs:SortBy>
                        <wfs:SortProperty>
                            <ogc:PropertyName>fid</ogc:PropertyName>
                            <wfs:SortOrder>A</wfs:SortOrder>
                        </wfs:SortProperty>
                    </wfs:SortBy>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:And>
                                <ogc:And>
                                    <ogc:PropertyIsLike matchCase="false" wildCard="*" singleChar="." escapeChar="u0021">
                                        <ogc:PropertyName>${country}</ogc:PropertyName>
                                        <ogc:Literal>*${text}*</ogc:Literal>
                                    </ogc:PropertyIsLike>
                                </ogc:And>
                            </ogc:And>
                        </ogc:And>
                    </ogc:Filter>
                </wfs:Query>
            </wfs:GetFeature>`,
        headers: {
        'Content-Type': 'application/xml'
        },
        method: 'POST'
    })

    return {title, result:result.data.features}
}
  exports.buscador = buscador
  //buscar('url', 'atributo', 'texto').then(data => console.log(data))
  buscador({url:'https://visor.obraspublicas.gob.ar/gs/ows?service=WFS&outputFormat=json',country:'Expediente', text:12, title:'hola'})
  .then(({ title, result}) => {console.log({title, result})})


