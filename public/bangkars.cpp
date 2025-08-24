#include <bits/stdc++.h>
#define ll long long
using namespace std;

class Solution {
public:
    void solve() {
        cout<<"Enter the process numbers"<<endl;
        int x,y;
        cin>>x;
        cout<<"Enter the resource numbers"<<endl;
        cin>>y;
        cout<<"Enter the resource's instances"<<endl;
        int res[y+5];
        for(int i=1; i<=y; i++) cin>>res[i];

        int need[x+5][y+5];
        int allocation[x+5][y+5];
        int maxi[x+5][y+5];
        int available[y+5];
        int alloc[y+5] = {0};

        cout<<"Enter the allocation matrix"<<endl;
        for(int i=1; i<=x; i++) {
            for(int j=1; j<=y; j++) {
                cout<<"Enter the "<<j<<" th resource allocation of process "<<i<<endl;
                cin>>allocation[i][j];
            }
        }

        cout<<"Enter the max matrix"<<endl;
        for(int i=1; i<=x; i++) {
            for(int j=1; j<=y; j++) {
                cout<<"Enter the "<<j<<" th max resource allocation of process "<<i<<endl;
                cin>>maxi[i][j];
            }
        }

        for(int i=1; i<=x; i++) {
            for(int j=1; j<=y; j++) {
                alloc[j] += allocation[i][j];
            }
        }
        for(int i=1; i<=y; i++) {
            available[i] = res[i] - alloc[i];
        }
        for(int i=1; i<=x; i++) {
            for(int j=1; j<=y; j++) {
                need[i][j] = maxi[i][j] - allocation[i][j];
            }
        }

        cout<<"Process_id     "<<"need_matrix"<<endl;
        for(int i=1; i<=x; i++) {
            cout<<i<<"                 ";
            for(int j=1; j<=y; j++) cout<<need[i][j]<<" ";
            cout<<endl;
        }

        int flag[x+5] = {0};
        vector<int> seq;

        while(true) {
            bool rr = 0;
            for(int i=1; i<=x; i++) {
                bool ok = 0;
                for(int j=1; j<=y; j++) {
                    if(need[i][j] > available[j]) {
                        ok = 1;
                        break;
                    }
                }
                if(ok==0 && flag[i]==0) {
                    flag[i] = 1;
                    rr = 1;
                    seq.push_back(i);
                    for(int j=1; j<=y; j++) available[j] += allocation[i][j];
                }
            }

            bool unfinished = 0;
            for(int i=1; i<=x; i++) if(flag[i]==0) unfinished = 1;

            if(!unfinished) {
                cout<<"Safe state"<<endl;
                cout<<"Safe Sequence"<<endl;
                for(auto v: seq) cout<<v<<" ";
                cout<<endl;
                break;
            }
            if(!rr) {
                cout<<"Not Safe state"<<endl;
                cout<<"Sequence"<<endl;
                for(auto v: seq) cout<<v<<" ";
                cout<<endl;
                break;
            }
        }
    }
};

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);

    ll t = 1;
    // cin >> t; // multiple test case চাইলে আনকমেন্ট করবে
    while(t--) {
        Solution obj;
        obj.solve();
    }
    return 0;
}
