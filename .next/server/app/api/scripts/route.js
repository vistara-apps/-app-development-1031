"use strict";(()=>{var e={};e.id=613,e.ids=[613],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},5315:e=>{e.exports=require("path")},8621:e=>{e.exports=require("punycode")},6162:e=>{e.exports=require("stream")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},2623:e=>{e.exports=require("worker_threads")},1568:e=>{e.exports=require("zlib")},7561:e=>{e.exports=require("node:fs")},4492:e=>{e.exports=require("node:stream")},2477:e=>{e.exports=require("node:stream/web")},6826:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>f,patchFetch:()=>x,requestAsyncStorage:()=>d,routeModule:()=>g,serverHooks:()=>h,staticGenerationAsyncStorage:()=>m});var s={};r.r(s),r.d(s,{GET:()=>p,POST:()=>l});var a=r(9303),o=r(8716),n=r(670),i=r(7070),c=r(5563),u=r(1926);async function p(e){try{let{searchParams:t}=new URL(e.url),r=t.get("state"),s=t.get("situation"),a=t.get("language")||"en";if(!r)return i.NextResponse.json({error:"State parameter is required"},{status:400});let o=u.OQ.from("scripts").select("*").eq("state",r).eq("language",a);s&&(o=o.eq("situation",s));let{data:n,error:p}=await o;if(p)return console.error("Error fetching scripts:",p),i.NextResponse.json({error:"Failed to fetch scripts"},{status:500});if(n&&n.length>0)return i.NextResponse.json({scripts:n});let l=[];for(let e of["traffic_stop","vehicle_search","home_search","arrest","stop_and_frisk","public_recording"])try{let t=await (0,c.H0)({prompt:`Generate appropriate user responses for ${e} situations`,context:{state:r,situation:e,language:a}}),s=await (0,c.H0)({prompt:`Generate typical officer scripts for ${e} situations`,context:{state:r,situation:e,language:a}}),o={state:r,situation:e,dialogue_type:"user_response",text:t,language:a,order_in_sequence:1},{data:n,error:i}=await u.OQ.from("scripts").insert(o).select().single();!i&&n&&l.push(n);let p={state:r,situation:e,dialogue_type:"officer_script",text:s,language:a,order_in_sequence:1},{data:g,error:d}=await u.OQ.from("scripts").insert(p).select().single();!d&&g&&l.push(g)}catch(t){console.error(`Error generating scripts for ${e}:`,t);continue}await new Promise(e=>setTimeout(e,2e3));let{data:g}=await u.OQ.from("scripts").select("*").eq("state",r).eq("language",a);return i.NextResponse.json({scripts:g||l})}catch(e){return console.error("Error in scripts API:",e),i.NextResponse.json({error:"Internal server error"},{status:500})}}async function l(e){try{let{state:t,situation:r,dialogue_type:s,language:a="en"}=await e.json();if(!t||!r||!s)return i.NextResponse.json({error:"State, situation, and dialogue_type are required"},{status:400});let o=await (0,c.H0)({prompt:`Generate ${"user_response"===s?"appropriate user responses":"typical officer scripts"} for ${r} situations`,context:{state:t,situation:r,language:a}}),n=[],{data:p,error:l}=await u.OQ.from("scripts").insert({state:t,situation:r,dialogue_type:s,text:o,language:a,order_in_sequence:1}).select().single();if(l)return console.error("Error saving script:",l),i.NextResponse.json({error:"Failed to save script"},{status:500});return p&&n.push(p),i.NextResponse.json({scripts:n})}catch(e){return console.error("Error creating scripts:",e),i.NextResponse.json({error:"Failed to create scripts"},{status:500})}}let g=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/scripts/route",pathname:"/api/scripts",filename:"route",bundlePath:"app/api/scripts/route"},resolvedPagePath:"/tmp/vistara-apps/-app-development-1031/src/app/api/scripts/route.ts",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:m,serverHooks:h}=g,f="/api/scripts/route";function x(){return(0,n.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:m})}},5563:(e,t,r)=>{r.d(t,{H0:()=>a,S0:()=>o,_d:()=>n});let s=new(r(4214)).ZP({apiKey:process.env.OPENAI_API_KEY||"dummy-key-for-build"});async function a(e){try{let{prompt:t,context:r}=e,a=`You are a legal rights advisor specializing in police interactions. 
    Generate clear, concise, and legally sound scripts for citizens during police encounters.
    
    Guidelines:
    - Keep responses brief and easy to remember under stress
    - Focus on de-escalation and constitutional rights
    - Avoid legal jargon - use plain language
    - Include both what to say and what NOT to say
    - Consider state-specific laws when provided
    - Prioritize safety and compliance while asserting rights
    
    Context: ${r?.state?`State: ${r.state}`:""} ${r?.situation?`Situation: ${r.situation}`:""} ${r?.language?`Language: ${r.language}`:""}`,o=await s.chat.completions.create({model:"gpt-4",messages:[{role:"system",content:a},{role:"user",content:t}],max_tokens:500,temperature:.3});return o.choices[0]?.message?.content||"Unable to generate script at this time."}catch(e){throw console.error("OpenAI API error:",e),Error("Failed to generate legal script")}}async function o(e){try{let t=`You are creating a professional incident summary for legal documentation.
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
    Description: ${e.description}`,a=await s.chat.completions.create({model:"gpt-3.5-turbo",messages:[{role:"system",content:t},{role:"user",content:r}],max_tokens:400,temperature:.2});return a.choices[0]?.message?.content||"Unable to generate incident summary."}catch(e){throw console.error("OpenAI API error:",e),Error("Failed to generate incident summary")}}async function n(e,t,r="en"){try{let a=`You are a legal expert creating citizen rights guides for police interactions.
    
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
    Length: 800-1000 words maximum`,o=`Create a legal rights guide for ${e} state covering ${t||"police interactions and citizen rights"}.`,n=await s.chat.completions.create({model:"gpt-4",messages:[{role:"system",content:a},{role:"user",content:o}],max_tokens:1200,temperature:.2});return n.choices[0]?.message?.content||"Unable to generate legal guide."}catch(e){throw console.error("OpenAI API error:",e),Error("Failed to generate legal guide")}}},1926:(e,t,r)=>{r.d(t,{OQ:()=>n});var s=r(9498);let a=process.env.NEXT_PUBLIC_SUPABASE_URL||"https://dummy-url-for-build.supabase.co",o=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"dummy-key-for-build",n=(0,s.eI)(a,o)}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,802],()=>r(6826));module.exports=s})();