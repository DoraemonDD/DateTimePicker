<template>
  <div v-outside>
    <input class="hm-ipt" v-model="currentSelectDate" />
    <div class="hm-picker" v-if="isShow">
      <div class="day-header">
        <span @click="preYear">&lt;&lt;</span>
        <span @click="preMonth">&lt;</span>
        <span>{{ currentYear }}</span>
        <span>{{ panelMonth }}</span>
        <span @click="nextMonth">&gt;</span>
        <span @click="nextYear">&gt;&gt;</span>
      </div>
      <div class="day-weeks">
        <span v-for="(week, index) in 7" :key="index">{{
          weeks[week - 1]
        }}</span>
      </div>
      <div class="day-counter" v-for="m in 6" :key="m">
        <span
          :class="{
            isNotCurrentMonth: !isNotCurrentMonth(
              getVisibleDays[(m - 1) * 7 + (n - 1)],
            ),
            isToday: isToday(getVisibleDays[(m - 1) * 7 + (n - 1)]),
          }"
          v-for="n in 7"
          :key="n"
          @click="selectDate"
          >{{ getVisibleDays[(m - 1) * 7 + (n - 1)].getDate() }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, type DirectiveBinding, type VNode, computed } from 'vue'
import * as utils from '@/utils'
const props = defineProps<{ time: Date }>()

const isShow = ref(false)

const currentMonth = ref(props.time.getMonth())

const currentYear = ref(props.time.getFullYear())

const weeks = ref(['日', '一', '二', '三', '四', '五', '六'])

const formateTime = (t: Date) => {
  const { year, month, day } = utils.formatTime(t)
  const m = padZero(month + 1)
  const d = padZero(day)
  return `${year}-${m}-${d}`
}

// 如果是个位在数字前面加0
function padZero(param: any) {
  return String(param).padStart(2, '0')
}

// 计算面板的日期
const getVisibleDays = computed(() => {
  // 在6行7列的矩形里显示42个日期
  const { year, month } = utils.formatTime(props.time) // 得到的月份比实际月少一，但是视频里是正确的月份，不知道他是怎么写的
  // 可以构造一个日期对象(获取指定年月的第一天)
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  // 获取当月第一天出现在星期几(下表从0开始)
  let weeks = firstDay.getDay()

  // if (weeks === 0) {
  //   weeks = 7
  // }

  // 如何计算面板中的第一天⭐⭐⭐⭐⭐
  const firstDate = (firstDay as any) - weeks * 24 * 60 * 60 * 1000
  // 遍历42天
  let arr = []
  for (let i = 0; i < 42; i++) {
    arr.push(new Date(firstDate + i * 24 * 60 * 60 * 1000))
  }

  return arr
})

// 判断是不是当前月
const isNotCurrentMonth = (t: Date) => {
  // const { year, month } = utils.formatTime(props.time)
  const updatedYear = currentYear.value
  const updatedMonth = currentMonth.value
  const { year: y, month: m } = utils.formatTime(t)
  return updatedYear === y && updatedMonth === m
}

// 是否是今天
const isToday = (t: Date) => {
  const { year, month, day } = utils.formatTime(new Date())
  const { year: y, month: m, day: d } = utils.formatTime(t)
  return year === y && month === m && day === d
}

// 计算显示的月份
const panelMonth = computed(() => {
  return currentMonth.value + 1
})

// 获取当前点击的那一天
const { day } = utils.formatTime(new Date())
// 点击选择的天
const selectedDay = ref(day)

// TODO 选择日期
const selectDate = (e?: any) => {
  selectedDay.value = e?.target?.innerText as any
  isShow.value = false
}

const currentSelectDate = computed(() => {
  // 获取当前的年份
  const year = currentYear.value
  // 获取当前月份
  const month = currentMonth.value + 1
  return `${year}-${month}-${selectedDay.value}`
})

// 上个月
const preMonth = () => {
  if (currentMonth.value < 1) {
    currentYear.value -= 1
    currentMonth.value = 11
  } else {
    currentMonth.value -= 1
  }
}

// 下个月
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentYear.value += 1
    currentMonth.value = 0
  } else {
    currentMonth.value += 1
  }
}

// 上一年
const preYear = () => {
  currentYear.value -= 1
}

// 下一年
const nextYear = () => {
  currentYear.value += 1
}

// 聚焦
const onFocus = () => {
  isShow.value = true
}
// 模糊
const onBlur = () => {
  isShow.value = false
}

// 自定义全局指令——判断用户点击是否在日期选择面板范围之内
// el表示面板范围 e表示点击区域
const vOutside = {
  mounted: (el: any, binding: DirectiveBinding, vnode: VNode) => {
    el.handler = function (e: Event) {
      if (el.contains(e.target as any)) {
        if (!isShow.value) {
          onFocus()
        }
      } else {
        if (isShow.value) {
          onBlur()
        }
      }
    }

    document.addEventListener('click', el.handler)
  },
  unmounted: (el: any, binding: DirectiveBinding, vnode: VNode) => {
    document.removeEventListener('click', el.handler)
  },
}
</script>
<style lang="scss" scoped>
// 输入框的类名
.hm-ipt {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  outline: none;
  padding: 0 15px;
  text-align: center;
}

// 日期选择器面板的类名
.hm-picker {
  position: absolute;
  width: 323px;
  height: 300px;
  color: #606266;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  background: #fff;
  border-radius: 4px;
  line-height: 30px;
  margin: 5px 0;
  z-index: 99;
}

.day-header {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.day-weeks {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.day-counter {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 8px;
}

.day-counter span {
  width: 30px;
  text-align: center;
  font-size: 14px;
}

.isNotCurrentMonth {
  color: #c0c4cc;
}

.isToday {
  color: #409eff;
  font-weight: 700;
}
</style>
