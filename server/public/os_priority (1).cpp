#include<bits/stdc++.h>
using namespace std;
int main()
{
    int x;
    cout<<"Enter the number of processes"<<endl;
    cin>>x;
    vector<pair<int,int> >v;
    int burst[x+1];
    int priority[x+1];
    int completion[x+1];
    int turnaround[x+1];
    int waiting[x+1];
    for(int i=1;i<=x;i++)
    {
        cout<<"Enter the burst time of process"<<" "<<i<<endl;
        int y;
        cin>>y;
        burst[i]=y;
        cout<<"Enter the priority of process"<<" "<<i<<endl;
        int z;
        cin>>z;
        priority[i]=z;
        v.push_back({z,i});
    }
    sort(v.begin(),v.end());
    int sum=0;
    float avg=0;
    for(int i=0;i<v.size();i++)
    {
        int id=v[i].second;
        sum+=burst[id];
        completion[id]=sum;
        turnaround[id]=completion[id];
        waiting[id]=turnaround[id]-burst[id];
        avg=avg+waiting[id];

    }
    cout<<"id"<<"     "<<"waiting_time"<< "     "<<"turnaround_time"<<endl;
    for(int i=1;i<=x;i++)
    {
        cout<<i<<"       "<<waiting[i]<<"                "<<turnaround[i]<<endl;
    }
    cout<<"average waiting time "<<(avg*1.0)/x<<endl;}
