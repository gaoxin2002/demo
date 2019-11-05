export const istel = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|(166)|(198)|(199)|(147))\d{8}$/;//电话验证
export const isyangzhengma = /^\d+$/;//验证数字
export const ispwd = /^\w{6,16}$/;//密码验证
export const testname = /^[\u4e00-\u9fa5]{2,8}$/u;//姓名验证
export const testidcard=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;//身份证验证
export const testBir = /^\d{8}$/;//8位数字验证
export const netAddress = "http://yiqi.guxiren.cn/";//拼接图片域名
export const netAddressVideo = "http://puk6cvmoh.bkt.clouddn.com/";//拼接视频域名
export function goto(str, token = true, isreplace = false) {
    if (!token) {
        this.$router.push({ path: '/login' });
        return;
    }
    if (isreplace) {
        this.$router.replace({ path: str });
        return;
    }
    this.$router.push({ path: str })
}

export function info(str = "loading", time = 2000) {
    const toast = this.$createToast({
        txt: str,
        type: 'warn',
        time: time
    })
    toast.show()
}