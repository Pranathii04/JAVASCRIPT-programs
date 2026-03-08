import {propertyForSaleArr} from './properties2/propertyForSaleArr.js'
import {placeholderPropertyObj} from './properties2/placeholderPropertyObj.js'



function getPropertyHtml(estateArr = [placeholderPropertyObj]) {

const htmlProperties = estateArr.map( house => {
    const {propertyLocation,priceGBP,roomsM2,comment, image}  = house;
    const totalRoomSize = roomsM2.reduce((tot,curr) => tot+curr,0)
    return`<section class="card">
    <img src="/images/${image}">
    <div class="card-right">
        <h2>${propertyLocation}</h2>
        <h3>${priceGBP}</h3>
        <p>${comment}</p>
        <h3>${totalRoomSize} m&sup2;</h3>
    </div>
</section> ` 
}).join('')

return htmlProperties
}

document.getElementById('container').innerHTML = getPropertyHtml([placeholderPropertyObj])