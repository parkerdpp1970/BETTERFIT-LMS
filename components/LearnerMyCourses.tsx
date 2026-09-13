import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, PlayCircle, Clock, BookOpen, Star } from 'lucide-react';

const COURSES = [
    {
        id: 1,
        title: 'L2 Gym Instructor Qualification',
        progress: 30,
        totalLessons: 12,
        completedLessons: 4,
        imageGradient: 'from-blue-600 to-indigo-800',
        tags: ['Core', 'Qualification'],
        lastAccessed: '2 hours ago'
    },
    {
        id: 2,
        title: 'L3 Personal Trainer Qualification',
        progress: 0,
        totalLessons: 20,
        completedLessons: 0,
        imageGradient: 'from-indigo-500 to-purple-700',
        tags: ['Qualification'],
        lastAccessed: 'Not started'
    },
    {
        id: 3,
        title: 'Nutritional Principles for PTs',
        progress: 100,
        totalLessons: 8,
        completedLessons: 8,
        imageGradient: 'from-emerald-500 to-teal-700',
        tags: ['CPD', 'Nutrition'],
        lastAccessed: 'Completed'
    },
    {
        id: 4,
        title: 'Business Skills for Fitness Pros',
        progress: 10,
        totalLessons: 15,
        completedLessons: 2,
        imageGradient: 'from-orange-400 to-red-500',
        tags: ['Business', 'CPD'],
        lastAccessed: '1 week ago'
    }
];

const LearnerMyCourses: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-3xl font-extrabold text-[#0c0c0d]">My Courses</h1>
              <p className="text-[#6c6c6c]">Manage your learning journey and pick up where you left off.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                  <input 
                      type="text" 
                      placeholder="Search my library..." 
                      className="w-full pl-10 pr-4 py-2 border border-[#afafaf] rounded-lg text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                  />
                  <Search className="w-4 h-4 text-[#afafaf] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button className="px-3 py-2 bg-white border border-[#afafaf] rounded-lg text-[#6c6c6c] hover:bg-slate-50">
                  <Filter className="w-5 h-5" />
              </button>
          </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {COURSES.map(course => (
              <div 
                  key={course.id} 
                  className="bg-white rounded-xl shadow-sm border border-[#afafaf]/50 overflow-hidden flex flex-col hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => navigate('/learner/lesson/1')}
              >
                  {/* Course Image Area */}
                  <div className={`h-40 bg-gradient-to-br ${course.imageGradient} relative p-6 flex flex-col justify-between`}>
                      <div className="flex justify-between items-start">
                          <div className="flex gap-1">
                              {course.tags.map(tag => (
                                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-black/20 text-white px-2 py-1 rounded backdrop-blur-sm">
                                      {tag}
                                  </span>
                              ))}
                          </div>
                          {course.progress === 100 && (
                              <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
                                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                              </div>
                          )}
                      </div>
                      <h3 className="text-white font-bold text-xl leading-tight shadow-black drop-shadow-md">
                          {course.title}
                      </h3>
                  </div>

                  {/* Course Content */}
                  <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between text-sm text-[#6c6c6c] mb-4">
                          <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" /> {course.totalLessons} Lessons
                          </div>
                          <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" /> {course.lastAccessed}
                          </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-auto">
                          <div className="flex justify-between text-xs font-bold mb-1 text-[#0c0c0d]">
                              <span>{course.progress}% Complete</span>
                              <span>{course.completedLessons}/{course.totalLessons}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${course.progress === 100 ? 'bg-green-500' : 'bg-[#01b3ef]'}`} 
                                  style={{ width: `${course.progress}%` }}
                              ></div>
                          </div>
                          
                          <button className={`w-full mt-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors ${
                              course.progress === 100 
                              ? 'bg-slate-100 text-[#0c0c0d] hover:bg-slate-200' 
                              : 'bg-[#01427a] text-white hover:bg-[#003366]'
                          }`}>
                              {course.progress === 0 ? 'Start Course' : course.progress === 100 ? 'Review Course' : 'Resume Course'}
                              {course.progress !== 100 && <PlayCircle className="w-4 h-4 ml-2" />}
                          </button>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default LearnerMyCourses;