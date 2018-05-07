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
                    dialogVisible: n
                })
            }
        }
    },
    data: {
        dialogVisible: false
    },
    methods: {}
})