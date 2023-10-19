<template>
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, i) in goods_info.pics" :key="i">
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		
		<view class="goods-info-box">
			<view class="price">
				￥{{goods_info.goods_price}}
			</view>
			
			<view class="goods-info-body">
				<view class="goods-name">
					{{goods_info.goods_name}}
				</view>
				
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			
			<view class="yf">
				快递，免运费
			</view>
		</view>
		
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		
		<view class="goods_nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick"></uni-goods-nav>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations,mapGetters} from 'vuex'
	export default {
		computed:{
			...mapState('m_cart',[]),
			...mapGetters('m_cart',['total'])
		},
		watch:{
			total:{
				handler(newVal){
					const findResult = this.options.find( x => x.text === '购物车')
					if(findResult){
						findResult.info = newVal
					}
				},
				immediate: true
			}
			
		},
		data() {
			return {
				goods_info: {},
				options: [ {
					icon: 'shop',
					text: '店铺'
					}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
						color: '#fff'
					}
				],
			};
		},
		onLoad(options) {
			const goods_id = options.goods_id
			this.getGoodsDetail(goods_id)
		},
		methods: {
			...mapMutations('m_cart',['addToCart']),
			async getGoodsDetail(goods_id){
				const {data: res} = await uni.$http.get('/api/public/v1/goods/detail',{goods_id})
				if(res.meta.status !== 200) return uni.$showMsg()
				res.message.goods_introduce.replace('<img/g','<img style="display:block:"').replace(/webp/g,'jpg')
				this.goods_info = res.message
			},
			preview(i){
				uni.previewImage({
					current:i,
					urls:this.goods_info.pics.map(x => x.pics_big)
				})
			},
			onClick(e){
				if(e.content.text === '购物车'){
					uni.switchTab({
						url:'/pages/cart/cart'
					})
				}
			},
			buttonClick(e){
				if(e.content.text === '加入购物车'){
					const goods = {
						goods_id: this.goods_info.goods_id,
						goods_name: this.goods_info.goods_name,
						goods_price: this.goods_info.goods_price,
						goods_count: 1,
						goods_samll_logo: this.goods_info.goods_samll_logo,
						goods_status: true
					}
					this.addToCart(goods)
				}
				
			}
		}
	}
</script>

<style lang="scss">
	swiper{
		height: 750rpx;
		image{
			height: 100%;
			width: 100%;
		}
	}
	
	.goods-info-box{
		padding: 10px;
		padding-right: 0;
		.price{
			color: #c00000;
			font-style: 18px;
			margin: 10px 0;
		}
		.goods-info-body{
			display: flex;
			justify-content: space-between;
			
			.goods-name{
				font-style: 13px;
				margin-right: 10px;
			}
			.favi{
				width: 120px;
				font-style: 12px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-left: 1px solid #efefef;
				color: gray;
				margin: 10px 0;
			}
		}
		.yf{
			font-style: 12px;
			color: gray;
		}
	}
	.goods_nav{
		position: fixed;
		z-index: 20;
		bottom: 0;
		width: 100%;
	}
	.goods-detail-container{
		padding-bottom: 50px;
	}
</style>
