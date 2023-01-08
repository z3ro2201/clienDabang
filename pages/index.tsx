import { useEffect, useState } from 'react'
import Head from 'next/head'
import home from  '../styles/Home.module.css'

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Home() {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)

  const kakaoAPI_KEY = process.env.NEXT_PUBLIC_KAKAOKEY

  const kakaoAPI_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAPI_KEY}&autoload=false&libraries=services`

  const dabangList = [
    /* 수도권 */
    { region: '서울', nickname: '시리피', company: '커피스토리', address: '서울특별시 구로구 고척동 185-9', comment: '', url: '', tel: '' }
  ]
  
  const loadMap = (address: any, idx:number) => {
    if(!address) return

    const mapLat:any = 33.450701
    const mapLng:any = 126.570667

    const kakao = (window as any).kakao

    kakao.maps.load(() => {
      const container = document.querySelector('#kakaoMap')
      const mapOption = {
        center: new kakao.maps.LatLng(mapLat, mapLng),
        level: 2
      }
      const mapTypeControl = new kakao.maps.MapTypeControl()
      const zoomControl = new kakao.maps.ZoomControl()
      
      const mapGeocoder = new kakao.maps.services.Geocoder()

      const mapGeo = mapGeocoder.addressSearch(address, (result:any, status:any) => {

        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x)

          //const markerPosition = new kakao.maps.LatLng(mapLat, mapLng)

          let comment = '', url = '', tel = '';

          if(dabangList[idx].comment) comment = `<div class="px-1">${dabangList[idx].comment}</div>`
          if(dabangList[idx].url) url = `<div class="px-1"><a href="${dabangList[idx].url}" target="_blank">${dabangList[idx].url}</div>`
          if(dabangList[idx].tel) tel = `<div class="px-1"><a href="tel:${dabangList[idx].tel}">${dabangList[idx].tel}</a></div>`

   //.wrap {position: absolute;left: 0;bottom: 40px;width: 288px;height: 132px;margin-left: -144px;text-align: left;overflow: hidden;font-size: 12px;font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;line-height: 1.5;}
          
          const content = `<div class=${home.wrap}>` +
                          ` <div class=${home.info}>` +
                          `   <div class=${home.title}>` +
                          `     ${dabangList[idx].company}` +
                          `   </div>` +
                          `   <div class="p-2">` +
                          //`     <div class=${home.img}></div>` +
                          //`     <div class=${home.desc}>` +
                          `       <div class="p-[10px]"><a href="javascript:;" onclick="navigator.clipboard.writeText('${dabangList[idx].address}');alert('클립보드에 복사되었습니다!')">${dabangList[idx].address}</a></div>` +
                          `       ${comment}`+
                          `       ${tel}`+
                          `       ${url}`+
                          //`     </div>` +
                          `   </div>` +
                          ` </div>` +
                          `</div>`
          

          const map = new kakao.maps.Map(container, mapOption)

          const mapMarker = new kakao.maps.Marker({
            content: content,
            map: map,
            position: coords
          })

          const overlay = new kakao.maps.CustomOverlay({
            content: content,
            map: map,
            position: mapMarker.getPosition()       
          });

          kakao.maps.event.addListener(mapMarker, 'click', function() {
            overlay.setMap(map);
          });

          map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)
          map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

          map.setCenter(coords)
        }
      })

    })
  }

  useEffect(() => {
    const $script = document.createElement('script')
    $script.src   = kakaoAPI_URL
    $script.addEventListener('load', () => setMapLoaded(true))
    document.head.appendChild($script)
  }, [])

  useEffect(() => {
    if(!mapLoaded) return;

    loadMap(dabangList[0].address, 0)

  }, [mapLoaded])

  /* style={{position: 'absolute', top: '120px', right: '100px', zIndex: '100'}}*/
  /* dabangList  style={{padding: '0px', margin: '0px', listStyle: 'none'}} */
  return (
    <>
      <Head>
        <title>클다방 목록</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500&family=Roboto:wght@300;400&display=swap" rel="stylesheet"/>
      </Head>
      <div id="kakaoMap" style={{width:'100vw', height:'100vh'}}></div>
      <div className="absolute z-[100] top-[20px] right-[20px] rounded-lg bg-white shadow-lg">
        <div className="p-2 bg-gray-800 font-semibold text-white rounded-tl-lg rounded-tr-lg">클다방 카페 목록</div>
        <ul id="dabangList" className="max-h-[220px] overflow-y-scroll p-0 m-0 list-none font-['Noto Sans KR'] text-sm">
          {
            dabangList.map((ele, idx)=> {
              return(<li key={idx} className="p-2">
                <p style={{margin: '0px'}} id="company">
                  <a href="#" onClick={() => loadMap(ele.address, idx)}>{ele.company}
                  </a>
                </p>
              </li>)
            })
          }
        </ul>
      </div>
    </>
  )
}
