import Vue from 'vue'
/**
 * 监听上拉滚动事件
 * @type {Object}
 */
export const loadMore = Vue.directive('loadMore',{
	bind (el,binding) {
		window.addEventListener('scroll',() => {
			if(document.body.scrollTop + window.innerHeight >= el.clientHeight){
				// console.log(binding.arg)
				// binding.arg = true;
				binding.value()
			}
		})
	}
})