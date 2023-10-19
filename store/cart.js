export default{
	namespaced:true,
	state:()=>({
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	mutations:{
		addToCart(state, goods){
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
			if(!findResult){
				state.cart.push(goods)
			}else{
				findResult.goods_count++
			}
			this.commit('m_cart/saveToStorage')
		},
		saveToStorage(state){
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		},
		updateGoodsStatus(state,goods){
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			
			if(findResult){
				findResult.goods_status = goods.goods_status
				this.commit('m_cart/saveToStorage')
			}
		},
		updateGoodsCount(state, goods){
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if(findResult){
				findResult.goods_count = goods.goods_count
				this.commit('m_cart/saveToStorage')
			}
		},
		removeGoodsById(state,goods_id){
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			this.commit('m_cart/saveToStorage')
		},
		updateAllGoodsStatus(state, newStatus){
			state.cart.forEach(x => x.goods_status = newStatus)
			this.commit('m_cart/saveToStorage')
			
		}
	},
	getters:{
		total(state){
			// let c = 0
			// state.cart.forEach(goods => c += goods.goods_count)
			// return c
			
			return state.cart.reduce((total, item) => total += item.goods_count, 0)
		},
		checkedCount(state){
			return state.cart.filter(x => x.goods_status).reduce((total, item) => total += item.goods_count, 0)
		},
		checkedGoodsAmount(state){
			return state.cart.filter(x => x.goods_status).reduce((total,item) => total += item.goods_count *item.goods_price, 0).toFixed(2)
		}
	}
}