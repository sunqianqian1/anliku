window.onload = function() {
    let swiper = $('.swiper')[0];
    let disList = $('.dis-list')[0];
    // console.log(swiper);

    // 向后台获取图片的数据
    // banner
    $.get(
        'http://localhost:3000/banner',
        function({ banners }) {
            // console.log(banners);
            let swiperWrap = '';
            banners.forEach((val, index) => {
                swiperWrap += `
                    <div class="swiper-slide">
                        <img class='banner-img' src='${val.imageUrl}'/>
                        <span class='banner-imgtype' style="background-color:${val.titleColor};">${val.typeTitle}</span>
                    </div>
                `;
            });


            swiper.innerHTML = `
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        ${swiperWrap}
                    </div>
                    <!-- Add Pagination -->
                    <div class="swiper-pagination"></div>
                </div>
            `;

            new Swiper('.swiper-container', {
                // 自动轮播
                autoplay: 1000,
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
        })

    // discover
    $.get(
        'http://localhost:3000/personalized',
        function({ result }) {
            console.log(result)
            disList.innerHTML = '';
            result.forEach((val, index) => {
                if (index < 6) {
                    disList.innerHTML += `
                    <li class="dis-item">
                        <a href="#">
                            <div class="dis-img">
                                <img src="${val.picUrl}" alt="">
                            </div>
                            <div class="dis-desc">
                                ${val.name}
                            </div>
                        </a>
                    </li>
                    `
                }
            })
        }
    )

    // $.get(
    //     'http://localhost:3000/personalized',
    //     function({ result }) {
    //         console.log(result);

    //         disList.innerHTML = '';

    //         result.forEach((item, index) => {
    //             if (index < 6) {
    //                 disList.innerHTML += `
    //             <li class="dis-item">
    //               <a href="#">
    //                 <div class="dis-img">
    //                   <img src="${item.picUrl}" alt="">
    //                 </div>
    //                 <div class="desc">
    //                   ${item.name}
    //                 </div>
    //               </a>
    //             </li>
    //           `
    //             }
    //         })
    //     }
    // )
}