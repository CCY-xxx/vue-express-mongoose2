<template>
    <div>
      <nav-header></nav-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>订单提交成功！</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>确认</span> 地址</li>
            <li class="cur"><span>查看</span> 订单</li>
            <li class="cur"><span>确认</span> 付款</li>
            <li class="cur"><span>订单</span> 成功</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/imgs/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>恭喜您! <br>您的订单正在处理中！</h3>
            <p>
              <span>订单号：{{orderId}}</span>
              <span>订单总金额：{{orderTotal|currency('$')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">我的购物车</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">商品列表</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import {currency} from './../util/currency'
    import axios from 'axios'
    export default{
        data(){
            return{
                orderId:'',
                orderTotal:0
            }
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread
        },
        filters:{
          currency:currency
        },
        mounted(){
            var orderId = this.$route.query.orderId;
            console.log("orderId:"+orderId);
            if(!orderId){
              return;
            }
            axios.get("/api/users/orderDetail",{
                params:{
                  orderId:orderId
                }
            }).then((response)=>{
                let res = response.data;
                if(res.status=='0'){
                    this.orderId = orderId;
                    this.orderTotal = res.result.orderTotal;
                }
            });
        }
    }
</script>
