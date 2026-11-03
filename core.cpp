#include <algorithm>
#include <cmath>
#include <cstdlib>
#include <iostream>
#include <iomanip>
// Estimate position between scheduled stops with a smooth acceleration profile.
int main(int argc, char** argv) {
  if (argc != 8) return 2;
  double a[6];
  for (int i=0;i<6;i++) { char* end; a[i]=std::strtod(argv[i+1], &end); if (*end || !std::isfinite(a[i])) return 2; }
  double now=std::strtod(argv[7], nullptr);
  if (a[5]<=a[4]) return 2;
  double t=std::clamp((now-a[4])/(a[5]-a[4]),0.0,1.0);
  double s=t*t*(3-2*t);
  std::cout<<std::fixed<<std::setprecision(6)<<a[0]+(a[2]-a[0])*s<<" "<<a[1]+(a[3]-a[1])*s<<"\n";
}
