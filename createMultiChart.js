const chartCreator = (where,type,titleText,subtitleText,xType,Ytitle,tooltip,pointInterval,pointIntervalStart)=>{
Highcharts.chart($(where),{
  chart:{
    type: type,
      scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1
      }
  },
  title:{
    text:titleText,
    align:'left'
  },
  subtitle: {
      text: subtitleText,
      align: 'left'
  },
  xAxis:{
    type: xType,
    label:{
      overflow: 'justify'
    }
  },
  yAxis:{
    title:{
    text:Ytitle,
    },
    minorGridLineWidth: 0,
    gridLineWidth: 0,
    alternateGridColor: null,
    plotBands:[]
  },
  tooltip:{
    valueSuffix: tooltip,
  },
  plotOption:{
    type:{
      lineWidth: 5,
      states:{
        hover:{
          lineWidth:5
        }
      },
      marker:{
        enabled: false
      },
      pointInterval:pointInterval,
      pointStart: pointIntervalStart

    }
  },
  series:[{
    name: seriesName,
    data: seriesData
  }],
  navigation:{
    menuItemStyle:{
      fontSize:'10px'
    }
  }
})

}