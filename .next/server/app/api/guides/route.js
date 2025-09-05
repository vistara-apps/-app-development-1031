"use strict";(()=>{var e={};e.id=264,e.ids=[264],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},5315:e=>{e.exports=require("path")},8621:e=>{e.exports=require("punycode")},6162:e=>{e.exports=require("stream")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},2623:e=>{e.exports=require("worker_threads")},1568:e=>{e.exports=require("zlib")},7561:e=>{e.exports=require("node:fs")},4492:e=>{e.exports=require("node:stream")},2477:e=>{e.exports=require("node:stream/web")},6861:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>f,patchFetch:()=>x,requestAsyncStorage:()=>g,routeModule:()=>p,serverHooks:()=>h,staticGenerationAsyncStorage:()=>m});var a={};r.r(a),r.d(a,{GET:()=>l,POST:()=>d});var o=r(9303),s=r(8716),n=r(670),i=r(7070),u=r(5563),c=r(1926);async function l(e){try{let{searchParams:t}=new URL(e.url),r=t.get("state"),a=t.get("language")||"en";if(!r)return i.NextResponse.json({error:"State parameter is required"},{status:400});let{data:o,error:s}=await c.OQ.from("legal_guides").select("*").eq("state",r).eq("language",a);if(s)return console.error("Error fetching guides:",s),i.NextResponse.json({error:"Failed to fetch guides"},{status:500});if(o&&o.length>0)return i.NextResponse.json({guides:o});let n=[];for(let e of["Traffic Stops and Vehicle Searches","Home Searches and Warrants","Arrest Procedures and Miranda Rights","Stop and Frisk Encounters","Public Photography and Recording Rights"])try{let t=await (0,u._d)(r,e,a),o={state:r,title:e,content:t,language:a},{data:s,error:i}=await c.OQ.from("legal_guides").insert(o).select().single();if(i){console.error("Error saving guide:",i);continue}s&&n.push(s)}catch(t){console.error(`Error generating guide for ${e}:`,t);continue}return i.NextResponse.json({guides:n})}catch(e){return console.error("Error in guides API:",e),i.NextResponse.json({error:"Internal server error"},{status:500})}}async function d(e){try{let{state:t,title:r,language:a="en"}=await e.json();if(!t||!r)return i.NextResponse.json({error:"State and title are required"},{status:400});let o=await (0,u._d)(t,r,a),{data:s,error:n}=await c.OQ.from("legal_guides").insert({state:t,title:r,content:o,language:a}).select().single();if(n)return console.error("Error saving guide:",n),i.NextResponse.json({error:"Failed to save guide"},{status:500});return i.NextResponse.json({guide:s})}catch(e){return console.error("Error creating guide:",e),i.NextResponse.json({error:"Failed to create guide"},{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/guides/route",pathname:"/api/guides",filename:"route",bundlePath:"app/api/guides/route"},resolvedPagePath:"/tmp/vistara-apps/-app-development-1031/src/app/api/guides/route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:g,staticGenerationAsyncStorage:m,serverHooks:h}=p,f="/api/guides/route";function x(){return(0,n.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:m})}},5563:(e,t,r)=>{r.d(t,{H0:()=>o,S0:()=>s,_d:()=>n});let a=new(r(4214)).ZP({apiKey:process.env.OPENAI_API_KEY||"dummy-key-for-build"});async function o(e){try{let{prompt:t,context:r}=e,o=`You are a legal rights advisor specializing in police interactions. 
    Generate clear, concise, and legally sound scripts for citizens during police encounters.
    
    Guidelines:
    - Keep responses brief and easy to remember under stress
    - Focus on de-escalation and constitutional rights
    - Avoid legal jargon - use plain language
    - Include both what to say and what NOT to say
    - Consider state-specific laws when provided
    - Prioritize safety and compliance while asserting rights
    
    Context: ${r?.state?`State: ${r.state}`:""} ${r?.situation?`Situation: ${r.situation}`:""} ${r?.language?`Language: ${r.language}`:""}`,s=await a.chat.completions.create({model:"gpt-4",messages:[{role:"system",content:o},{role:"user",content:t}],max_tokens:500,temperature:.3});return s.choices[0]?.message?.content||"Unable to generate script at this time."}catch(e){throw console.error("OpenAI API error:",e),Error("Failed to generate legal script")}}async function s(e){try{let t=`You are creating a professional incident summary for legal documentation.
    Generate a clear, factual summary that includes:
    - Location and time information
    - Situation type and description
    - Relevant legal context for the state
    - Professional, neutral tone
    
    Language: ${"es"===e.language?"Spanish":"English"}
    Keep it concise but comprehensive for legal purposes.`,r=`Create an incident summary for:
    Location: ${e.location.address||`${e.location.lat}, ${e.location.lon}`}
    State: ${e.state}
    Situation Type: ${e.situationType}
    Description: ${e.description}`,o=await a.chat.completions.create({model:"gpt-3.5-turbo",messages:[{role:"system",content:t},{role:"user",content:r}],max_tokens:400,temperature:.2});return o.choices[0]?.message?.content||"Unable to generate incident summary."}catch(e){throw console.error("OpenAI API error:",e),Error("Failed to generate incident summary")}}async function n(e,t,r="en"){try{let o=`You are a legal expert creating citizen rights guides for police interactions.
    
    Create a comprehensive but concise guide covering:
    - Constitutional rights (4th, 5th, 6th amendments)
    - State-specific laws and procedures
    - Traffic stop procedures
    - Search and seizure rights
    - Arrest procedures
    - Contact information for legal aid
    
    ${t?`Focus specifically on: ${t}`:""}
    
    Format: Clear sections with bullet points
    Language: ${"es"===r?"Spanish":"English"}
    Length: 800-1000 words maximum`,s=`Create a legal rights guide for ${e} state covering ${t||"police interactions and citizen rights"}.`,n=await a.chat.completions.create({model:"gpt-4",messages:[{role:"system",content:o},{role:"user",content:s}],max_tokens:1200,temperature:.2});return n.choices[0]?.message?.content||"Unable to generate legal guide."}catch(e){throw console.error("OpenAI API error:",e),Error("Failed to generate legal guide")}}},1926:(e,t,r)=>{r.d(t,{OQ:()=>n});var a=r(9498);let o=process.env.NEXT_PUBLIC_SUPABASE_URL||"https://dummy-url-for-build.supabase.co",s=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"dummy-key-for-build",n=(0,a.eI)(o,s)}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[276,802],()=>r(6861));module.exports=a})();