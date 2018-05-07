Component({
    options: {
        multipleSlots: true
    },
    properties: {
        visible: {
            type: Boolean,
            value: false,
            observer: function (n, o) {
                this.setData({
                    sheetVisible: n
                })
            }
        },
        title: {
            type: String
        },
        menu: {
            type: Array,
            value: [],
            observer: function (n, o) {
                this.setData({
                    menuData: n
                })
            }
        },
        cancel: {
            type: String
        },
    },
    data: {
        sheetVisible: false,
        menuData: []
    },
    methods: {
        cancel: function () {
            this.triggerEvent('hide')
        },
        itemtap: function (e) {
            const checkedItem = e.currentTarget.dataset.index
            this.triggerEvent('change', checkedItem)
        }
    }
})