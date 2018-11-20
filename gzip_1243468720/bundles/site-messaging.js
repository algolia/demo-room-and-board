RNB.Util.createNS('RNB.Globals.Dynamics');(function(){'use strict';var link='/api/web/global-dynamic';RNB.Globals.Dynamics=mobx.extendObservable({},{loadData:mobx.action(function(){var promise=axios.get(link).then(function(response){RNB.Globals.Dynamics.setData(response.data);},function(error){console.error(error);});return promise;}),setData:mobx.action(function(data){RNB.Globals.Dynamics.data=mobx.extendObservable({},data);RNB.Globals.Dynamics.setCachedGlobalData();}),setCachedGlobalData:mobx.action(function setCachedGlobalData(){try{if(window.sessionStorage){window.sessionStorage.setItem('GlobalData',JSON.stringify(RNB.Globals.Dynamics.data));}}catch(error){console.warn('`sessionStorage` not supported, using session cookies instead',error);RNB.Util.cookies('GlobalData',JSON.stringify(RNB.Globals.Dynamics.data));}}),cachedGlobalData:mobx.computed(function getCachedUserData(){var result;try{if(window.sessionStorage){result=window.sessionStorage.getItem('GlobalData');}}catch(error){console.warn('`sessionStorage` not supported, using session cookies instead',error);result=RNB.Util.cookies('GlobalData');}
return _.isEmpty(result)?'':JSON.parse(result);}),data:{siteMessage:null}});if(RNB.Globals.Dynamics.cachedGlobalData){RNB.Globals.Dynamics.setData(_.get(RNB.Globals.Dynamics,'cachedGlobalData'));}
RNB.Globals.Dynamics.loadData();})();RNB.Util.createNS('RNB.SiteMessaging');(function(){'use strict';var mounted=false;RNB.SiteMessaging.Renderer=mobxReact.observer(function SITE_MESSAGING_RENDERER(props){var message=props.message;var children=[];if(!props.useContactUsMessage){children=[React.createElement('h2',{key:'site-primary-message',className:'site-primary-message',dangerouslySetInnerHTML:{__html:message.primaryMessage}})];children.push(React.createElement('span',{key:'site-secondary-message',className:'site-secondary-message',dangerouslySetInnerHTML:{__html:message.secondaryMessage}}));}else{children.push(React.createElement('h2',{key:'site-secondary-message',className:'site-secondary-message',dangerouslySetInnerHTML:{__html:message.weAreHereToHelpMessage}}));}
return React.createElement('div',{key:'site-message-container',className:'site-message '+message.type,'role':'alert'},children);});RNB.SiteMessaging.init=function(options){var opt=options||{};var id=opt.elementId?opt.elementId:'site-messaging-holder';var msg=opt.message?opt.message:RNB.Globals.Dynamics.data.siteMessage;if(!_.isUndefined(msg)&&!_.isNull(msg)){RNB.SiteMessaging.behaviors(msg);ReactDOM.render(React.createElement(RNB.SiteMessaging.Renderer,{message:msg,useContactUsMessage:opt.useContactUsMessage||false}),document.getElementById(id));mounted=true;}else if(mounted){ReactDOM.unmountComponentAtNode(document.getElementById(id));}};mobx.autorun(function(){var msg=RNB.Globals.Dynamics.data.siteMessage;RNB.SiteMessaging.init({message:msg});});})();RNB.Util.createNS('RNB.SiteMessaging');(function(){'use strict';var mounted=false;RNB.SiteMessaging.Renderer=mobxReact.observer(function SITE_MESSAGING_RENDERER(props){var message=props.message;var children=[];if(!props.useContactUsMessage){children=[React.createElement('h2',{key:'site-primary-message',className:'site-primary-message',dangerouslySetInnerHTML:{__html:message.primaryMessage}})];children.push(React.createElement('span',{key:'site-secondary-message',className:'site-secondary-message',dangerouslySetInnerHTML:{__html:message.secondaryMessage}}));}else{children.push(React.createElement('h2',{key:'site-secondary-message',className:'site-secondary-message',dangerouslySetInnerHTML:{__html:message.weAreHereToHelpMessage}}));}
return React.createElement('div',{key:'site-message-container',className:'site-message '+message.type,'role':'alert'},children);});RNB.SiteMessaging.init=function(options){var opt=options||{};var id=opt.elementId?opt.elementId:'site-messaging-holder';var msg=opt.message?opt.message:RNB.Globals.Dynamics.data.siteMessage;if(!_.isUndefined(msg)&&!_.isNull(msg)){RNB.SiteMessaging.behaviors(msg);ReactDOM.render(React.createElement(RNB.SiteMessaging.Renderer,{message:msg,useContactUsMessage:opt.useContactUsMessage||false}),document.getElementById(id));mounted=true;}else if(mounted){ReactDOM.unmountComponentAtNode(document.getElementById(id));}};mobx.autorun(function(){var msg=RNB.Globals.Dynamics.data.siteMessage;RNB.SiteMessaging.init({message:msg});});})();