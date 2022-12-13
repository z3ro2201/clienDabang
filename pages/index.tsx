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

  //const kakaoAPI_KEY = "66dd76d3cb5d55be4db72039e50b5e08"
  const kakaoAPI_KEY = process.env.NEXT_PUBLIC_KAKAOKEY

  const kakaoAPI_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAPI_KEY}&autoload=false&libraries=services`

  const dabangList = [
    /* 수도권 */
    { region: '서울', nickname: '시리피', company: '커피스토리', address: '서울특별시 구로구 고척동 185-9', comment: '', url: '', tel: '' },
    { region: '서울', nickname: 'u402', company: '카페이유', address: '서울특별시 강동구 암사동 461-11', comment: '로스팅, 핸드드립, 원두판매, 더치보틀 판매, 홍스공방과 함께 있어요', url: '', tel: '070-8887-6262' },
    { region: '서울', nickname: '테이크알', company: '카페 테이크알', address: '서울특별시 강북구 미아동 187-42', comment: '', url: 'https://www.instagram.com/cafe_take_r', tel: '010-9028-8794' },
    { region: '서울', nickname: 'Roasters', company: '커피 인류', address: '서울특별시 송파구 잠실동 35-2 트리지움상가 1층', comment: '로스팅, 원두판매, 핸드드립, 더치 스트롱홀드 에스트리니타7, 훼마 e61 주빌레', url: '', tel: '070-4634-2212' },
    { region: '서울', nickname: '밤비', company: '커피찾는남자', address: '서울특별시 성동구 성수일로12길 52 상가동 106호', comment: '방문 전 인스타에 휴무 공지 있는지 확인 부탁드립니다', url: 'https://www.instagram.com/coffee_explorer', tel: '070-8628-9532' },
    { region: '서울', nickname: 'Leeky', company: '리키 커피랩', address: '서울특별시 광진구 뚝섬로56길 14-1', comment: '오후 6시 닫습니다. 일요일 휴무입니다', url: '', tel: '' },
    { region: '경기', nickname: 'MEEK', company: 'Cafe Leez (카페리즈)', address: '경기도 부천시 원미구 중동 1116 리첸시아 A동 123, 124호', comment: '로스팅 - 매장 원두판매 / 핸드드립 / 과일착즙 디톡스 / 유기농 블랜드  / 콜드브루', url: 'https://www.instagram.com/cafe_leez', tel: '' },
    { region: '경기', nickname: '정마에', company: '정지영 커피 로스터즈', address: '경기도 수원시 팔달구 신풍로 42', comment: 'Roasting, Brewing, Education, Extraction, Consulting ', url: '', tel: '070-7537-0091' },
    { region: '경기', nickname: '현대판한량', company: '한량의 커피 이야기', address: '경기도 시흥시 대야동 478-1번지 석윤스카이빌 A동 102호', comment: '커피볶는집, 좌식테이블, 복층', url: 'https://www.facebook.com/coffeehanryang', tel: '031-311-9514' },
    { region: '경기', nickname: 'QRoaster', company: 'Q.Roaster', address: '경기도 남양주시 진접읍 금곡리 1039-4, 102호', comment: '원두 납품 / 판매 / 커피 메뉴만 있습니다', url: '', tel: '010-8373-1580' },
    { region: '경기', nickname: '그의미소', company: '바이크 인 커피', address: '경기도 안양시 만안구 석수동 연현로109 101호', comment: '', url: 'https://www.instagram.com/bikeincoffee', tel: '070-8624-4102' },
    { region: '경기', nickname: 'magic9143', company: '에인트커피', address: '경기도 광주시 역동로 83', comment: '매주화요일 휴무입니다. 아직까지도 초보사장님입니다 :D', url: 'https://www.instagram.com/aint_coffee', tel: '031-797-9143' },
    { region: '경기', nickname: 'BaristaDic', company: '바리스타 딕셔너리', address: '경기도 용인시 처인구 모현면 능원로 41-6', comment: '', url: '', tel: '031-322-9130' },
    { region: '경기', nickname: 'BaristaDiC', company: '어웨이크 키친 역북점', address: '경기도 용인시 처인구 명지로16번길 9-11', comment: '', url: '', tel: '' },
    { region: '경기', nickname: '라이트이어', company: '페이드 다운', address: '경기도 고양시 덕양구 의장로 29-10', comment: '내성적인 부부가 운영하는 작은 가게입니다.<br/>남편은 커피를 내리고 아내는 베이킹을 합니다. 고양 이케아에서 아주 가까워요.', url: 'https://www.instagram.com/cafe_fadedown', tel: '' },
    { region: '인천', nickname: '드로아크', company: '커피향기 Caffe Aroma', address: '인천광역시 남동구 백범로 467번길 14', comment: '', url: '', tel: '' },

    /* 강원권 */
    { region: '강원', nickname: 'colorbug', company: 'VALVE Coffee Roasters', address: '강원도 춘천시 석사동 848-10', comment: '로스팅샵', url: 'https://blog.naver.com/lord5580', tel: '033-262-1820' },

    /* 충청권 */
    { region: '대전', nickname: '아론아빠', company: '커피 광장 로스터즈', address: '대전광역시 서구 둔산동1141 서쪽 1층', comment: '', url: '', tel: '042-484-5034' },
    { region: '충북', nickname: '버거매니아', company: '다울카페 1호점', address: '충청북도 제천시 송학면 도화리 950번지', comment: '버거매니아 님은 99.9% 2호점 근무', url: '', tel: '' },
    { region: '충북', nickname: '버거매니아', company: '다울카페 2호점', address: '충청북도 제천시 중앙로 1가 40-3', comment: '버거매니아 님은 99.9% 2호점 근무', url: '', tel: '' },

    /* 호남권역 */
    { region: '전북', nickname: '갑인가배', company: '가빈가배 COFFEE', address: '전라북도 전주시 완산구 풍남동3가 1 ', comment: '', url: '', tel: '010-8669-5949' },

    /* 영남권역 */
    { region: '대구', nickname: 'XGLORY', company: '스테디 커피 본점', address: '대구광역시 달서구 진천로10길 90-3', comment: '연중무휴입니다 ㅋ', url: 'https://www.instagram.com/steady.coffee', tel: '070-7573-2470' },
    { region: '대구', nickname: 'SoulFlight', company: '더플래닛커피로스터즈', address: '대구광역시 수성구 만촌로 108, 1층', comment: '로스팅(매장원두판매, 직접블렌딩한 원두사용(에스프레소/베리에이션 분리)<br/>핸드드립/더치커피/베이커리/교육실운영 ', url: 'https://www.facebook.com/planetcoffeeroasters', tel: '053-752-0812' },
    { region: '부산', nickname: '게으른고양이', company: '게으른고양이', address: '부산광역시 영도구 태종로 522 상록빌딩 1층', comment: '', url: 'https://www.facebook.com/cafelazycat', tel: '' },
    { region: '부산', nickname: '브리안', company: '배러 댄 와플 해운대점', address: '부산광역시 해운대구 구남로 29번길 21 세이브존 1층 정문, 리베로호텔 1층 정문', comment: '테이크아웃 와플 가게입니다.<br/>유럽 스페셜티 공인 자격심사관, 큐그레이더 아라비카 커피 감정사, 골든커피어워드 심사위원이<br/>참가하여 로스팅한 원두 사용, 매일 로스팅, 5일이내 100% 스페셜티 커피만 사용.', url: '', tel: '010-8687-8867' },
    { region: '부산', nickname: '커피너마저', company: 'EL CIERVO', address: '부산광역시 기장군 장안읍 장안로 197', comment: '매주 월요일 휴무, 12~20시 운영', url: '', tel: '' },

    /* 제주권역 */
    { region: '제주', nickname: '위노', company: 'RVO어반 브루잉', address: '제주특별자치도 제주시 신설로 9길 42-8, 103호', comment: '', url: 'https://www.instagram.com/urban.brewing', tel: '' },
    //{ nickname: '', company: '', address: '', lat: , lng: },
  ]

  /*const loadMap = (mapLat:any, mapLng:any) => {
    if(!mapLat || !mapLng) {
      console.log('NOT')
      return 
    }

    console.log('반응!')

    kakao.maps.load(() => {
      const container = document.querySelector('#kakaoMap')
      const mapOption = {
        center: new kakao.maps.LatLng(mapLat, mapLng),
        level: 1
      }

      const markerPosition = new kakao.maps.LatLng(mapLat, mapLng)

      const mapMarker = new kakao.maps.Marker({
        position: markerPosition
      })

      const map = new kakao.maps.Map(container, mapOption)

      mapMarker.setMap(map)
    })
  }*/
  
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
