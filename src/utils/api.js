import request from '@/utils/request'
import qs from 'qs'
import config from '@/utils/config'
var url=config.requestConfig.url
export default {
  url:url,
  ADMIN: {
    login: params => request({
      url: url+'Login/Login',
      method: 'post',
      data: qs.stringify(params)
    }),
    getInfo: params => request({
      url: 'vue-admin-template/user/info',
      method: 'get',
      params: {
        token: params
      }
    }),
    modify : params => request({
      url: url+'Login/UpdatePassword', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    logout: () => request({
      url: 'vue-admin-template/user/logout',
      method: 'post'
    })
  },
  PROTOTYPE: {
    getTypeList: params => request({
      url: url+'Bss/GetProductInfoList',
      method: 'post',
      data: qs.stringify(params)
    }),
    getTable: params => request({
      url: url+'Bss/GetProductModel',
      method: 'post',
      data: qs.stringify(params)
    }),
    addTable : params => request({
      url: url+'Bss/AddProductModel', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    editTable : params => request({
      url: url+'Bss/UpdateProductModel', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    delTable: params => request({
      url: url+'Bss/DelProductModel',
      method: 'post',
      data:qs.stringify(params)
    })
  },
  PRODUCT: {
    getAgencyProvinceList: params => request({
      url: url+'Bss/QueryPartnerProvince',
      method: 'post',
      data: qs.stringify(params)
    }),
    getAgencyList: params => request({
      url: url+'Bss/QueryPartnerByProvince',
      method: 'post',
      data: qs.stringify(params)
    }),
    getStoreList: params => request({
      url: url+'Bss/QueryStoreByPartnerId',
      method: 'post',
      data: qs.stringify(params)
    }),
    getTypeList: params => request({
      url: url+'Bss/GetProductInfoList',
      method: 'post',
      data: qs.stringify(params)
    }),
    getNameList: params => request({
      url: url+'Bss/GetProductModelByType',
      method: 'post',
      data: qs.stringify(params)
    }),
    getTable: params => request({
      url: url+'Bss/GetWarrantyInfo',
      method: 'post',
      data: qs.stringify(params)
    }),
    addTable : params => request({
      url: url+'Bss/AddWarrantyInfo', 
      method: 'post', 
      data:params
    }),
    editTable : params => request({
      url: url+'Bss/UpdateWarrantyInfo', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    delTable: params => request({
      url: url+'Bss/DelWarrantyInfo',
      method: 'post',
      data:qs.stringify(params)
    }),
    getDownloadTable: params => request({
      url: url+'Bss/GetWarrantyExcelInfo',
      method: 'post',
      data:qs.stringify(params)
    }),
  },
  CUSTOMER: {
    getTable: params => request({
      url: url+'Bss/GetCustomerInfo',
      method: 'post',
      data: qs.stringify(params)
    }),
    editTable : params => request({
      url: url+'Bss/UpdateWarrantyDetail', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    delTable: params => request({
      url: url+'Bss/DelWarrantyDetail',
      method: 'post',
      data:qs.stringify(params)
    }),
    passTable: params => request({
      url: url+'Bss/PassWarrantyDetail',
      method: 'post',
      data:qs.stringify(params)
    }),
    refuseTable: params => request({
      url: url+'Bss/RefuseWarrantyDetail',
      method: 'post',
      data:qs.stringify(params)
    }),
    getDownloadTable: params => request({
      url: url+'Bss/GetCustomerExcelInfo',
      method: 'post',
      data:qs.stringify(params)
    }),
  },
  PARTNER: {
    getProvinceList: params => request({
      url: url+'Bss/QueryPartnerProvince',
      method: 'post',
      data: qs.stringify(params)
    }),
    getCityList: params => request({
      url: url+'Bss/QueryPartnerCity',
      method: 'post',
      data: qs.stringify(params)
    }),
    getCountyList: params => request({
      url: url+'Bss/QueryPartnerCounty',
      method: 'post',
      data: qs.stringify(params)
    }),
    getTable: params => request({
      url: url+'Bss/GetPartnerInfo',
      method: 'post',
      data: qs.stringify(params)
    }),
    addTable : params => request({
      url: url+'Bss/AddPartner', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    editTable : params => request({
      url: url+'Bss/UpdatePartner', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    delTable: params => request({
      url: url+'Bss/DelPartner',
      method: 'post',
      data:qs.stringify(params)
    }),
    resetTable: params => request({
      url: url+'PartnerUser/ResetPassword',
      method: 'post',
      data:qs.stringify(params)
    })
  },
  STORE: {
    getPartnerList: params => request({
      url: url+'Bss/QueryPartnerByProvince',
      method: 'post',
      data: qs.stringify(params)
    }),
    getProvinceList: params => request({
      url: url+'Bss/QueryStoreProvince',
      method: 'post',
      data: qs.stringify(params)
    }),
    getCityList: params => request({
      url: url+'Bss/QueryStoreCity',
      method: 'post',
      data: qs.stringify(params)
    }),
    getAreaList: params => request({
      url: url+'Bss/QueryStoreCounty',
      method: 'post',
      data: qs.stringify(params)
    }),
    getTable: params => request({
      url: url+'Bss/GetStoreInfo',
      method: 'post',
      data: qs.stringify(params)
    }),
    addTable : params => request({
      url: url+'Bss/AddStoreInfo', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    editTable : params => request({
      url: url+'Bss/UpdateStoreInfoByAdmin', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    delTable: params => request({
      url: url+'Bss/DelStore',
      method: 'post',
      data:qs.stringify(params)
    }),
    passTable: params => request({
      url: url+'Bss/PassStore',
      method: 'post',
      data:qs.stringify(params)
    }),
    refuseTable: params => request({
      url: url+'Bss/RefuseStore',
      method: 'post',
      data:qs.stringify(params)
    }),
    getDownloadTable: params => request({
      url: url+'Bss/GetStoreExcelInfo',
      method: 'post',
      data:qs.stringify(params)
    }),
  },
  IMAGES: {
    getBrandList: params => request({
      url: url+'QCloud/GetImgCaseBrand',
      method: 'post',
      data: qs.stringify(params)
    }),
    getModelList: params => request({
      url: url+'QCloud/GetImgCaseModel',
      method: 'post',
      data: qs.stringify(params)
    }),
    getTable: params => request({
      url: url+'QCloud/GetImgCaseInfo',
      method: 'post',
      data: qs.stringify(params)
    }),
    addTable : params => request({
      url: url+'QCloud/AddImgCase', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    editTable : params => request({
      url: url+'QCloud/UpdateImgCase', 
      method: 'post', 
      data:qs.stringify(params)
    }),
    delTable: params => request({
      url: url+'QCloud/DelImgCase',
      method: 'post',
      data:qs.stringify(params)
    }),
  },
  CAR:{
    BRAND: {
      getTable: params => request({
        url: url+'Car/QueryBrandAll',
        method: 'post',
        data: qs.stringify(params)
      }),
      addTable : params => request({
        url: url+'Car/AddCarBrand', 
        method: 'post', 
        data:params
      }),
      editTable : params => request({
        url: url+'Car/UpdateCarBrand', 
        method: 'post', 
        data:params
      }),
      delTable: params => request({
        url: url+'Car/DelCarBrand',
        method: 'post',
        data:qs.stringify(params)
      }),
    },
    MODEL: {
      getDetails: params => request({
        url: url+'Car/GetCarInfoById',
        method: 'post',
        data: qs.stringify(params)
      }),
      getBrandList: params => request({
        url: url+'Car/QueryBrand',
        method: 'post',
        data: qs.stringify(params)
      }),
      getTable: params => request({
        url: url+'Car/GetCarInfo',
        method: 'post',
        data: qs.stringify(params)
      }),
      addTable : params => request({
        url: url+'Car/AddCar', 
        method: 'post', 
        data:qs.stringify(params)
      }),
      editTable : params => request({
        url: url+'Car/UpdateCar', 
        method: 'post', 
        data:qs.stringify(params)
      }),
      delTable: params => request({
        url: url+'Car/DelCar',
        method: 'post',
        data:qs.stringify(params)
      }),
    },
  },
  BANNER: {
    getTable: params => request({
      url: url+'QCloud/GetImgCaseInfo',
      method: 'post',
      data: qs.stringify(params)
    }),
    editTable : params => request({
      url: url+'QCloud/UpdateImgCase', 
      method: 'post', 
      data:qs.stringify(params)
    })
  },
}
