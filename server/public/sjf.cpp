#include <bits/stdc++.h>
using namespace std;
int main()
{
    cout<<"Enter the number of process:"<<endl;
    int x;
    cin>>x;
    vector<pair<int,int> >v;
    int waiting_time[x+1];
    int burst_time[x+1];
    int turnaround_time[x+1];
    for(int i=1; i<=x; i++)
    {
        cout<<"Enter the burst time of process: "<<i<<endl;
        int y;
        cin>>y;
        v.push_back({y,i});
        burst_time[i]=y;
    }
    sort(v.begin(),v.end());
    waiting_time[v[0].second]=0;
    turnaround_time[v[0].second]=waiting_time[v[0].second]+burst_time[v[0].second];
    float avg=0;
    avg=avg+waiting_time[v[0].second];

    for(int i=1; i<v.size(); i++)
    {
      int id=v[i].second;
      int prev=v[i-1].second;
      waiting_time[id]=waiting_time[prev]+burst_time[prev];
      turnaround_time[id]=waiting_time[id]+burst_time[id];
      avg=avg+waiting_time[id];
    }
     cout<<"Process"<<"    "<<"Waiting_time"<<"     "<<"Burst_time"<<endl;
     for(int i=1;i<=x;i++)
     {
         cout<<i<<"               "<<waiting_time[i]<<"                 "<<turnaround_time[i]<<endl;
     }
    cout<<"Average waiting time:"<<(avg*1.0)/x <<endl;

}
