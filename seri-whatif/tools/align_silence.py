#!/usr/bin/env python3
"""Perkiraan timestamp tanpa Scribe: silencedetect + DP (paragraf -> kelompok segmen bicara), kata dibagi per panjang huruf.
Usage: align_silence.py vo.mp3 paras.json out_words.json"""
import json,re,subprocess,sys
mp3,pj,out=sys.argv[1:4]; paras=json.load(open(pj))
log=subprocess.run(['ffmpeg','-hide_banner','-i',mp3,'-af','silencedetect=n=-35dB:d=0.3','-f','null','-'],capture_output=True,text=True).stderr
dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',mp3]))
ss=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',log)]; se=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',log)]
segs=[];cur=0.0
for a,b in zip(ss,se+[dur]):
    if a-cur>0.05: segs.append((cur,a))
    cur=b
if dur-cur>0.2: segs.append((cur,dur))
L=[len(p) for p in paras]; rate=sum(e-s for s,e in segs)/sum(L)
N,P=len(segs),len(paras); INF=1e18
dp=[[INF]*(N+1) for _ in range(P+1)]; bk=[[0]*(N+1) for _ in range(P+1)]; dp[0][0]=0
for i in range(1,P+1):
  for j in range(1,N+1):
    for k in range(i-1,j):
      if dp[i-1][k]>=INF: continue
      d=sum(e-s for s,e in segs[k:j]); c=dp[i-1][k]+((d-L[i-1]*rate)/(L[i-1]*rate))**2
      if c<dp[i][j]: dp[i][j]=c; bk[i][j]=k
j=N;groups=[]
for i in range(P,0,-1): k=bk[i][j]; groups.append(segs[k:j]); j=k
groups.reverse(); words=[]
for p,g in zip(paras,groups):
    toks=p.split(); tot=sum(len(t)+1 for t in toks); spoken=sum(e-s for s,e in g)
    # map cumulative char fraction onto concatenated speech time
    def at(f):
        x=f*spoken
        for s,e in g:
            if x<=e-s: return s+x
            x-=e-s
        return g[-1][1]
    c=0
    for t in toks:
        a=at(c/tot); c+=len(t)+1; b=at((c-1)/tot); words.append({"text":t,"start":round(a,2),"end":round(b,2),"type":"word"})
json.dump({"words":words},open(out,'w'))
print(len(segs),"segmen ->",P,"paragraf")
