import Vue from 'vue'
import {
 Button, Form, FormItem, Input,
  Message, Container, Header,
   Aside, Main, Footer, Menu, Submenu,
   MenuItemGroup, MenuItem, Breadcrumb,
   BreadcrumbItem, Card, Switch, Link,
    Select, Option, DatePicker, CheckboxGroup,
     Checkbox, Upload, Dialog, InputNumber, TabPane, Tabs,
     Avatar, Divider, Col, Row, Progress, Pagination, Badge,
     Dropdown, DropdownItem, DropdownMenu, MessageBox, Image,
     Tooltip, Table, TableColumn, Popconfirm, Popover, Collapse, CollapseItem,
     PageHeader, Timeline, TimelineItem, Empty
} from 'element-ui'
// import { compressAccurately } from 'image-conversion' // 按需引入
// Vue.use(compressAccurately)
// 注册组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Switch)
Vue.use(Link)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Footer)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Avatar)
Vue.use(Divider)
Vue.use(Col)
Vue.use(Row)
Vue.use(Progress)
Vue.use(Pagination)
Vue.use(Badge)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Image)
Vue.use(Tooltip)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Popconfirm)
Vue.use(Popover)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(PageHeader)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Empty)
// Vue.use(Result)

// Vue.use(ImageViewer)

// Message直接挂载在Vue的原型上，这样所有Vue实例都能调用
// Message只是一些函数方法，没有提供组件标签，因此没有Vue.use来install
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$prompt = MessageBox.prompt
