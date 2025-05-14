
// Main service file that re-exports everything
import { CNHService } from './search/CNHService';
import { VehicleService } from './search/VehicleService';
import { SearchHistoryService } from './search/SearchHistoryService';
import { MockDataService } from './search/MockDataService';

// Re-export all services to maintain the same API
const InfoSimplesService = {
  // CNH operations
  searchCNH: CNHService.search,
  
  // Vehicle operations
  searchVehicle: VehicleService.search,
  
  // History operations
  saveSearchHistory: SearchHistoryService.saveSearchHistory,
  getSearchHistory: SearchHistoryService.getSearchHistory,
  updateSearchHistory: SearchHistoryService.updateSearchHistory,
  exportSearchHistory: SearchHistoryService.exportSearchHistory,
  
  // Mock data
  getMockFines: MockDataService.getMockFines
};

export default InfoSimplesService;
