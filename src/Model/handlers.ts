export function updateItem<ItemType extends Object>(payload: {item: ItemType, update: any}) {
    const newItem: ItemType = {...payload.item, _updatingDate: Date.now()}
    for (let key in payload.update) {
        if (payload.update.hasOwnProperty(key) && payload.item.hasOwnProperty(key)) {
            //@ts-ignore
            newItem[key] = payload.update[key]
        }
    }
    return newItem
}

export function areFieldsEquals<ItemType extends Object>(payload: {item: ItemType, filter: any}) {
    let isReturned = true
    for (let key in payload.filter) {
        if (payload.filter.hasOwnProperty(key) && payload.item.hasOwnProperty(key)) {
            //@ts-ignore
            isReturned &&= payload.item[key] === payload.filter[key]
        } else {
            isReturned = false
        }
    }
    return isReturned
}