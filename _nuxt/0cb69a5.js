(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{492:function(e,t,n){"use strict";n.r(t);var l=n(531),r=n(518),o=n(535),c=n(530),v=n(529),d=n(442),m=n(90),f=(n(188),n(7),n(26),n(50),n(191),function(e){return e.getFullYear()+"-"+e.getMonth()+"1-"+e.getDate()+" "+e.getHours()+":"+e.getMinutes()+":"+e.getSeconds()}),_=n(127),h={props:{doctor_id:[Number,String],doctor:{type:[Array,Object],default:function(){return[]}}},setup:function(e){var t=Object(_.e)("default"),n=Object(_.e)(""),l=Object(_.e)(""),r=Object(_.d)(["all","pending","approved","passed"]),o=Object(_.e)(0),c=Object(_.e)([]),v=Object(_.e)(null),d=Object(_.e)(null),h=Object(_.e)(null),O=Object(_.e)(null),y=Object(_.e)(null),j=Object(_.e)(null),D=Object(_.a)((function(){var t=null;return null!=e.doctor.appoitment_calendar&&null!=e.doctor.appoitment_calendar&&(e.doctor.appoitment_calendar.forEach((function(e){var n=new Date(e.start_time);null!=t?t>n&&(t=n):t=n})),t=t.getFullYear()+"-"+t.getMonth()+"1-"+t.getDate()),t})),w=function(e){return new Date(e.year,e.month-1,e.day,e.hour,e.minute).getTime()},S=function(){var t=[];if(null!=e.doctor.appoitment_calendar&&null!=e.doctor.appoitment_calendar){for(var i=0;i<e.doctor.appoitment_calendar.length;i++){var l=e.doctor.appoitment_calendar[i];if(""!=n.value&&l.status===n.value||""==n.value){t.push({name:l.requester,color:l.color_code,start:Date.parse(l.start_time),end:Date.parse(l.end_time),timed:!0,id:l.appointment_id})}}c.value=t}};return{colorChip:t,valueFilter:n,value:l,listFilter:r,appointment_id_dragging:o,events:c,dragEvent:v,dragStart:d,dragTime:h,createEvent:O,createStart:y,extendOriginal:j,getStartDate:D,getTag:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},genColor:function(e){return"approved"===e?"green":"pending"===e?"pink":"passed"===e?"grey":void 0},startDrag:function(e){var t=e.event,n=e.timed;o.value=t.id,t&&n&&(v.value=t,h.value=null,j.value=null)},startTime:function(e){var t=w(e);if(v.value&&null===h.value){var n=v.value.start;h.value=t-n}},mouseMove:function(t){var n=w(t);if(v.value&&null!==h.value){var l=v.value.start,r=v.value.end-l,c=function(time){var e=9e5;return arguments.length>1&&void 0!==arguments[1]&&!arguments[1]?time+(e-time%e):time-time%e}(n-h.value),d=c+r,m=new Date(c),_=f(m),O=new Date(d),y=f(O);null!=e.doctor.appoitment_calendar&&null!=e.doctor.appoitment_calendar&&e.doctor.appoitment_calendar.forEach((function(e){e.appointment_id==o.value&&(e.start_time=_,e.end_time=y)})),v.value.start=c,v.value.end=d}},endDrag:function(){if(h.value=null,v.value=null,O.value=null,y.value=null,j.value=null,null!=e.doctor.appoitment_calendar&&null!=e.doctor.appoitment_calendar){var t=localStorage.getItem("doctors");if(null!=t&&null!=t){var n=JSON.parse(t);n.forEach((function(t){t.doctor_id===e.doctor.doctor_id&&(t.appoitment_calendar=[],t.appoitment_calendar=Object(m.a)(e.doctor.appoitment_calendar))})),localStorage.setItem("doctors",JSON.stringify(n))}}o.value=0},cancelDrag:function(){if(O.value)if(j.value)O.value.end=j.value;else{var i=c.value.indexOf(O.value);-1!==i&&c.value.splice(i,1)}O.value=null,y.value=null,h.value=null,v.value=null},getEvents:S,handleFilter:function(e){"all"==e&&(e=""),n.value=e,S()}}}},O=h,y=n(86),component=Object(y.a)(O,(function(){var e=this,t=e._self._c;return t("div",{staticStyle:{"margin-top":"10px"}},[t("div",{staticStyle:{"margin-bottom":"10px"}},[t(d.a,{staticClass:"py-4 px-1",attrs:{elevation:"10"}},[t(o.a,{attrs:{"active-class":"primary--text",mandatory:""}},e._l(e.listFilter,(function(n){return t(r.a,{key:n,attrs:{"text-color":"white",color:e.genColor(n)},on:{click:function(t){return e.handleFilter(n)}}},[e._v("\n          "+e._s(e.getTag(n))+"\n        ")])})),1)],1)],1),e._v(" "),t(v.a,{staticClass:"fill-height"},[t(c.a,[t(d.a,{attrs:{height:"500"}},[t(l.a,{ref:"calendar",attrs:{color:"primary",type:"week",events:e.events,"event-ripple":!1,start:e.getStartDate},on:{change:e.getEvents,"mousedown:event":e.startDrag,"mousedown:time":e.startTime,"mousemove:time":e.mouseMove,"mouseup:time":e.endDrag},nativeOn:{mouseleave:function(t){return e.cancelDrag.apply(null,arguments)}},scopedSlots:e._u([{key:"event",fn:function(n){n.event,n.timed;var l=n.eventSummary;return[t("div",{staticClass:"v-event-draggable",domProps:{innerHTML:e._s(l())}})]}}]),model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1)],1)],1)],1)}),[],!1,null,null,null);t.default=component.exports}}]);