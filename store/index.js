import { defineStore } from 'pinia'
import useIccProvider from '../hooks/useIccProvider'

const provider = useIccProvider()

function state() {
	return {
		contacts: []
	}
}

const actions = {
	orderBy({ column, order }) {
		this.contacts = this.contacts.sort(
			(a, b) => {
				const sortRes = a[column].localeCompare(b[column],'zh-CN')
				return order ? sortRes : sortRes * -1
			}
		)
	},
	refreshContacts() {
		this.contacts = provider.queryAll()
	},
	getOneById(id) {
		return this.contacts.find(item => item.id == id)
	},
	insert(contact) {
		contact = { tag: contact.nam, number: contact.num }
		return provider.insert(contact)
	},
	update(contact) {
		const olderCon = this.getOneById(contact.id)
		contact = {
			tag: olderCon.nam,
			newTag: contact.nam,
			number: olderCon.num,
			newNumber: contact.num
		}
		return provider.update(contact)
	},
	remove(contact) {
		const where = `tag='${contact.nam}' AND number='${contact.num}'`
		return provider.remove(where)
	}
}

const useStore = defineStore('main', {
	state,
	actions
})

export default useStore