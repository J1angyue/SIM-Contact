<template>
	<uni-search-bar
		placeholder="可搜索名称 / 号码"
		@confirm="searchVal = $event.value"
		@cancel="searchVal = ''"
	/>
		<uni-list>
			<uni-swipe-action>
				<uni-swipe-action-item
					v-for="con in contacts"
					:key="con.id"
					:right-options="rightOpts"
					@click="confirmDelContact(con)"
				>
					<uni-list-item
						:title="con.nam"
						:note="con.num"
						:to="DETAILS_PATH + '?id=' + con.id"
						clickable
						link
					/>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</uni-list>
	<uni-fab
		horizontal="right"
		direction="vertical"
		:content="fabContent"
		@trigger="triggerContent"
	/>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import useStore from '../../store'

import inputPNG from './input.png'
import refreshPNG from './refresh.png'
import namPNG from './nam.png'
import numPNG from './num.png'
import incPNG from './inc.png'
import decPNG from './dec.png'

const DETAILS_PATH = '/pages/Details/index'
const FAB_CONTENT = {
	ORDER_INC: { text: '升序', iconPath: incPNG },
	ORDER_DEC: { text: '降序', iconPath: decPNG },
	COLUMN_NAM: { text: '按名排', iconPath: namPNG },
	COLUMN_NUM: { text: '按号排', iconPath: numPNG },
	INSERT: { text: '添加', iconPath: inputPNG },
	REFRESH: { text: '刷新', iconPath: refreshPNG }
}

const $store = useStore()

const searchVal = ref('')
const order = reactive({
	column: 'nam', order: 0
})
const fabContent = computed(() => [
	order.order ? FAB_CONTENT.ORDER_DEC : FAB_CONTENT.ORDER_INC,
	order.column === 'num' ? FAB_CONTENT.COLUMN_NAM : FAB_CONTENT.COLUMN_NUM,
	FAB_CONTENT.INSERT,
	FAB_CONTENT.REFRESH
])

const rightOpts = reactive([
	{
		text: '删除',
		style: { backgroundColor: '#dd524d' }
	}
])

const contacts = computed(() => {
	if (!searchVal.value) {
		return $store.contacts
	}
	return $store.contacts.filter(
		item => item.nam.includes(searchVal.value) || item.num.includes(searchVal.value)
	)
})

function triggerContent({ item }) {
	switch (item.text) {
		case FAB_CONTENT.REFRESH.text:
			uni.showToast({ title: '频繁刷新会烧卡，勿重复点击', icon: 'loading' })
			$store.refreshContacts()
			break
		case FAB_CONTENT.INSERT.text:
			uni.navigateTo({ url: DETAILS_PATH })
			break
		case FAB_CONTENT.ORDER_INC.text:
			order.order = 1
			$store.orderBy(order)
			break
		case FAB_CONTENT.ORDER_DEC.text:
			order.order = 0
			$store.orderBy(order)
			break
		case FAB_CONTENT.COLUMN_NAM.text:
			order.column = 'nam'
			$store.orderBy(order)
			break
		case FAB_CONTENT.COLUMN_NUM.text:
			order.column = 'num'
			$store.orderBy(order)
			break
		default:
			uni.showToast({ title: '你点了啥？？？' })
			break	
	}
}

function confirmDelContact(con) {
	uni.showModal({
	    title: '确认',
	    content: `确认删除${con.nam}(${con.num})吗？删除后无法恢复！`,
	    success: function (res) {
	        if (res.confirm) {
	            $store.remove(con)
	        }
	    }
	})
}

onMounted(() => {
	$store.refreshContacts()
	uni.showToast({ title: '加载完成' })
})
</script>
