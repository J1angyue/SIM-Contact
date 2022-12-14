<template>
	<uni-forms :modelValue="contact" label-position="top">
		<uni-row>
			<uni-col :span="22" :offset="1">
				<uni-forms-item required label="名称" name="nam">
					<uni-easyinput focus v-model="contact.nam" placeholder="请输入名称" />
				</uni-forms-item>
			</uni-col>
			<uni-col :span="22" :offset="1">
				<uni-forms-item required label="号码" name="num">
					<uni-easyinput v-model="contact.num" type="number" placeholder="请输入号码"/>
				</uni-forms-item>				
			</uni-col>
			<uni-col :span="22" :offset="1">
				<button type="primary" @click="saveContact">保存</button>
			</uni-col>
		</uni-row>
	</uni-forms>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { reactive } from 'vue'
import useStore from '../../store'

const $store = useStore()
const contact = reactive({id: '', nam: '', num: '' })

function saveContact() {
	if (contact.id === undefined) {
		showSaveCode($store.insert(contact))
		return
	}
	showSaveCode($store.update(contact))
}

function loadContact({ id }) {
	const con = $store.getOneById(id)
	contact.id = con?.id
	contact.nam = con?.nam ?? ''
	contact.num = con?.num ?? ''
}

function showSaveCode(code) {
	switch (code) {
		case -4:
			uni.showToast({ title: 'SIM 卡未就绪' })
			break
		case -3:
			uni.showToast({ title: 'SIM 卡已满' })
			break
		case -2:
			uni.showToast({ title: '名称过长' })
			break
		case -1:
			uni.showToast({ title: '号码过长' })
			break
		case 0:
			uni.showToast({ title: '操作未知' })
			break
		case 1:
			uni.showToast({ title: '操作成功' })
			break
		default:
			uni.showToast({ title: '原生API非正常返回 (' + code + ')' })
			break
	}
}

onLoad(loadContact)
</script>