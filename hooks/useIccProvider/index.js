const IccProvider = plus.android.importClass('com.android.internal.telephony.IccProvider')
const Uri = plus.android.importClass('android.net.Uri')
const ContentValues = plus.android.importClass('android.content.ContentValues')

const provider = new IccProvider()
const SIMURI = Uri.parse('content://icc/adn')

function getCursorColVal(cursor, colNam) {
	// cursor.getString(cursor.getColumnIndex("_id"))
	return plus.android.invoke(
		cursor,
		'getString',
		plus.android.invoke(cursor, 'getColumnIndex', colNam)
	)
}

function jsObj2Cv(jsObj) {
	const cV = new ContentValues()
	Object.keys(jsObj).forEach(k => cV.put(k, jsObj[k]))
	return cV
}

const iccProvider = {
	queryAll() {
		const cursor = provider.query(SIMURI, null, null, null, null)

		const result = []
		if (plus.android.invoke(cursor, 'getCount')) {
			while(plus.android.invoke(cursor, 'moveToNext')) {
				result.push({
					id: getCursorColVal(cursor, '_id'),
					nam: getCursorColVal(cursor, 'name'),
					num: getCursorColVal(cursor, 'number'),
				})
			}
		}
		plus.android.invoke(cursor, 'close')
		return result
	},
	insert(contact) {
		return provider.insert(SIMURI, jsObj2Cv(contact))
	},
	update(contact) {
		return provider.update(SIMURI, jsObj2Cv(contact), null, null)
	},
	remove(where) {
		provider.delete(SIMURI, where, null)
	}
}

export default function useIccProvider() {
	return iccProvider
}